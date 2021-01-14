const os = require('os')
const path = require('path')
const fs = require('fs-extra')
var moment = require('moment');
moment.locale('zh-cn');

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
    taskFile: path.join(os.homedir(), '.AutoSignMachine', 'taskFile_' + moment().format('YYYYMMDD') + '.json'),
    // 初始化待执行的任务队列
    initTasksQueue: async () => {
        let taskNames = Object.keys(tasks)
        let queues = []
        if (!fs.existsSync(scheduler.taskFile)) {
            // 开始时间
            const startDate = new Date();
            // 截止时间
            const endDate = moment().endOf('days').toDate();
            for (let taskName of taskNames) {
                // 随机时间
                let randomTime = moment(randomDate(startDate, endDate)).format('YYYY-MM-DD HH:mm:ss');

                let options = tasks[taskName].options
                if (options && options.isCircle) {
                    // 周期任务，固定检查点为一天的起点
                    randomTime = moment().startOf('days').format('YYYY-MM-DD HH:mm:ss');
                }
                queues.push({
                    taskName: taskName,
                    taskState: 0,
                    willTime: randomTime,
                    waitTime: Math.floor(Math.random() * 600) + 'seconds'
                })
            }
            if (queues.length) {
                fs.ensureFileSync(scheduler.taskFile)
                fs.writeFileSync(scheduler.taskFile, JSON.stringify(queues))
            }
        }
    },
    genFileName (command) {
        scheduler.taskFile = path.join(os.homedir(), '.AutoSignMachine', 'taskFile_' + command + '_' + moment().format('YYYYMMDD') + '.json')
    },
    loadTasksQueue: async () => {
        let queues = []
        let will_queues = []
        if (fs.existsSync(scheduler.taskFile)) {
            let taskJson = fs.readFileSync(scheduler.taskFile).toString('utf-8')
            queues = JSON.parse(taskJson)
        }
        for (let task of queues) {
            if (task.taskState === 0 && moment(task.willTime).isBefore(moment(), 'minutes')) {
                will_queues.push(task)
            }
        }
        return {
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
    hasWillTask: async (command) => {
        await scheduler.genFileName(command)
        await scheduler.initTasksQueue()
        let { will_queues } = await scheduler.loadTasksQueue()
        return will_queues.length
    },
    execTask: async (command) => {
        await scheduler.genFileName(command)
        await scheduler.initTasksQueue()
        let { queues, will_queues } = await scheduler.loadTasksQueue()
        if (will_queues.length) {
            for (let task of will_queues) {
                if (task.taskName in tasks) {
                    try {
                        if (task.waitTime) {
                            console.log('延迟执行', task.waitTime)
                            var willTime = new moment(task.willTime)
                            var waitTime = willTime.add(task.waitTime)
                            var seconds = parseInt(moment.duration(waitTime.diff(willTime)).asSeconds())
                            await new Promise((resolve, reject) => setTimeout(resolve, seconds * 1000))
                        }
                        await tasks[task.taskName]['callback']()
                        if (!(tasks[task.taskName].options && tasks[task.taskName].options.isCircle)) {
                            queues[queues.findIndex(q => q.taskName === task.taskName)] = {
                                ...task,
                                taskState: 1
                            }
                            fs.writeFileSync(scheduler.taskFile, JSON.stringify(queues))
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