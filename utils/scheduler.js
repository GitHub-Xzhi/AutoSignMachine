const os = require('os')
const path = require('path')
const fs = require('fs-extra')
var moment = require('moment');
moment.locale('zh-cn');
const { getCookies, saveCookies, delCookiesFile } = require('./util')
const _request = require('./request')

const randomDate = (startDate, endDate) => {
    let date = new Date(+startDate + Math.random() * (endDate - startDate));
    let hour = date.getHours() + Math.random() * (20 - date.getHours()) | 0;
    let minute = 0 + Math.random() * (59 - 0) | 0;
    let second = 0 + Math.random() * (59 - 0) | 0;
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);
    return date;
};
let tasks = {}
let scheduler = {
    taskFile: path.join(os.homedir(), '.AutoSignMachine', 'taskFile.json'),
    today: '',
    isRunning: false,
    isTryRun: false,
    taskJson: undefined,
    queues: [],
    will_queues: [],
    taskKey: 'default',
    buildQueues: async () => {
        let queues = []
        let taskNames = Object.keys(tasks)
        let startDate = new Date();
        let endDate = moment().endOf('days').toDate();
        for (let taskName of taskNames) {
            let options = tasks[taskName].options
            if (options) {
                startDate = options.startHours ? moment().startOf('days').add(options.startHours, 'hours') : startDate
                endDate = options.endHours ? moment().startOf('days').add(options.endHours, 'hours') : endDate
            }
            let willTime = moment(randomDate(startDate, endDate));
            if (options) {
                if (options.isCircle || options.dev) {
                    willTime = moment().startOf('days');
                }
                if (options.startTime) {
                    willTime = moment().startOf('days').add(options.startTime, 'seconds');
                }
            }
            let waitTime = options.dev ? 0 : Math.floor(Math.random() * 600)
            if (scheduler.isTryRun) {
                willTime = moment().startOf('days');
                waitTime = 0;
            }
            queues.push({
                taskName: taskName,
                taskState: 0,
                willTime: willTime.format('YYYY-MM-DD HH:mm:ss'),
                waitTime: waitTime
            })
        }
        return queues
    },
    // 初始化待执行的任务队列
    initTasksQueue: async () => {
        const today = moment().format('YYYYMMDD')
        if (!fs.existsSync(scheduler.taskFile)) {
            console.log('任务配置文件不存在，创建配置中')
            let queues = await scheduler.buildQueues()
            fs.ensureFileSync(scheduler.taskFile)
            fs.writeFileSync(scheduler.taskFile, JSON.stringify({
                today,
                queues
            }))
        } else {
            let taskJson = fs.readFileSync(scheduler.taskFile).toString('utf-8')
            taskJson = JSON.parse(taskJson)
            if (taskJson.today !== today) {
                console.log('日期已变更，重新生成任务配置')
                let queues = await scheduler.buildQueues()
                fs.writeFileSync(scheduler.taskFile, JSON.stringify({
                    today,
                    queues
                }))
            }
        }
        scheduler.today = today
    },
    genFileName(command) {
        scheduler.taskFile = path.join(os.homedir(), '.AutoSignMachine', `taskFile_${command}_${scheduler.taskKey}.json`)
        scheduler.today = moment().format('YYYYMMDD')
        console.log('获得配置文件', scheduler.taskFile, '当前日期', scheduler.today)
    },
    loadTasksQueue: async () => {
        let queues = []
        let will_queues = []
        let taskJson = {}
        if (fs.existsSync(scheduler.taskFile)) {
            taskJson = fs.readFileSync(scheduler.taskFile).toString('utf-8')
            taskJson = JSON.parse(taskJson)
            if (taskJson.today === scheduler.today) {
                queues = taskJson.queues
            }
            if (scheduler.isTryRun) {
                fs.unlinkSync(scheduler.taskFile)
            }
        }
        for (let task of queues) {
            if (task.taskState === 0 && moment(task.willTime).isBefore(moment(), 'minutes')) {
                will_queues.push(task)
            }
        }
        console.log(`获取总任务数${queues.length}，已完成任务数${queues.filter(q => q.taskState === 1).length}，将执行任务数${will_queues.length}`)
        scheduler.taskJson = taskJson
        scheduler.queues = queues
        scheduler.will_queues = will_queues
        return {
            taskJson,
            queues,
            will_queues
        }
    },
    regTask: async (taskName, callback, options) => {
        tasks[taskName] = {
            callback,
            options
        }
    },
    hasWillTask: async (command, params) => {
        const { taskKey, tryrun } = params
        scheduler.isTryRun = tryrun
        scheduler.taskKey = taskKey || 'default'
        if (scheduler.isTryRun) {
            console.log('!!!当前运行在TryRun模式，仅建议在测试时运行!!!')
            await new Promise((resolve) => setTimeout(resolve, 3000))
        }
        console.log('将使用', scheduler.taskKey, '作为账户识别码')
        console.log('计算可执行任务')
        await scheduler.genFileName(command)
        await scheduler.initTasksQueue()
        let { will_queues } = await scheduler.loadTasksQueue()
        scheduler.isRunning = true
        return will_queues.length
    },
    execTask: async (command, selectedTasks) => {
        console.log('开始执行任务')
        if (!scheduler.isRunning) {
            await scheduler.genFileName(command)
            await scheduler.initTasksQueue()
        }
        selectedTasks = selectedTasks ? selectedTasks.split(',').filter(q => q) : ''
        if (selectedTasks.length) {
            console.log('将只执行选择的任务', selectedTasks.join(','))
        }
        let { taskJson, queues, will_queues } = scheduler
        let init
        if (will_queues.length) {
            for (let task of will_queues) {
                let newTask = {}
                if (task.taskName in tasks &&
                    (
                        !selectedTasks.length ||
                        selectedTasks.length && selectedTasks.indexOf(task.taskName) !== -1
                    )) {
                    try {
                        if (task.waitTime) {
                            console.log('延迟执行', task.waitTime, 'seconds')
                            await new Promise((resolve, reject) => setTimeout(resolve, task.waitTime * 1000))
                        }

                        let ttt = tasks[task.taskName]
                        let tttOptions = ttt.options || {}
                        if (scheduler.isTryRun) {
                            await delCookiesFile([command, scheduler.taskKey].join('_'))
                        }
                        let savedCookies = await getCookies([command, scheduler.taskKey].join('_')) || tttOptions.cookies
                        let request = _request(savedCookies)
                        if (tttOptions.init) {
                            if (!init) {
                                init = await tttOptions['init'](request, savedCookies)
                            }
                            await ttt['callback'](init.request, init.data)
                        } else {
                            await ttt['callback'](request)
                        }

                        let isupdate = false
                        if (ttt.options) {
                            if (!ttt.options.isCircle) {
                                newTask.taskState = 1
                                isupdate = true
                            }
                            if (ttt.options.isCircle && ttt.options.intervalTime) {
                                newTask.willTime = moment().add(ttt.options.intervalTime, 'seconds').format('YYYY-MM-DD HH:mm:ss')
                                isupdate = true
                            }
                        } else {
                            newTask.taskState = 1
                            isupdate = true
                        }

                        if (isupdate) {
                            queues[queues.findIndex(q => q.taskName === task.taskName)] = {
                                ...task,
                                ...newTask
                            }
                            taskJson.queues = queues
                            fs.writeFileSync(scheduler.taskFile, JSON.stringify(taskJson))
                        }
                    } catch (err) {
                        console.log('任务错误：', err)
                    }
                }
            }
        } else {
            console.log('今日暂无需要执行的任务')
        }
    }
}
module.exports = {
    scheduler
}