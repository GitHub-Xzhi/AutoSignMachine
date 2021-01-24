
const path = require('path')
const { scheduler } = require('../utils/scheduler')

exports.command = 'wps'

exports.describe = 'wps签到任务'

exports.builder = function (yargs) {
    return yargs
        .option('wps_sid', {
            describe: 'cookie项wps_sid的值',
            type: 'string'
        })
        .option('csrf', {
            describe: 'cookie项csrf的值',
            type: 'string'
        })
        .help()
        .showHelpOnFail(true, '使用--help查看有效选项')
        .epilog('copyright 2020 LunnLew');
}

exports.handler = async function (argv) {
    var command = argv._[0]
    await require(path.join(__dirname, 'tasks', command, command)).start({
        cookies: {
            wps_sid: argv.wps_sid,
            csrf: argv.csrf,
        },
        options: {}
    }).catch(err => console.log("wps签到任务:", err.message))
    let hasTasks = await scheduler.hasWillTask(command, 'tryrun' in argv)
    if (hasTasks) {
        scheduler.execTask(command, argv.tasks).catch(err => console.log("wps签到任务:", err.message)).finally(() => {
            console.log('全部任务执行完毕！')
        })
    } else {
        console.log('暂无可执行任务！')
    }
}