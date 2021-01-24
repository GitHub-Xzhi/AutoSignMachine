
const path = require('path')
const { scheduler } = require('../utils/scheduler')

exports.command = '10086'

exports.describe = '10086签到任务'

exports.builder = function (yargs) {
    return yargs
        .option('cookies', {
            describe: 'cookies',
            type: 'string'
        })
        .help()
        .showHelpOnFail(true, '使用--help查看有效选项')
        .epilog('copyright 2020 LunnLew');
}

exports.handler = async function (argv) {
    var command = argv._[0] + ''
    await require(path.join(__dirname, 'tasks', command, command)).start({
        cookies: argv.cookies,
        options: {}
    }).catch(err => console.log("10086签到任务:", err.message))
    let hasTasks = await scheduler.hasWillTask(command, 'tryrun' in argv)
    if (hasTasks) {
        scheduler.execTask(command, argv.tasks).catch(err => console.log("10086签到任务:", err.message)).finally(() => {
            console.log('全部任务执行完毕！')
        })
    } else {
        console.log('暂无可执行任务！')
    }
}