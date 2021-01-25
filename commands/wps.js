
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
    var accounts = []
    if ('accountSn' in argv && argv.accountSn) {
        let accountSns = argv.accountSn.split(',')
        for (let sn of accountSns) {
            if (('wps_sid-' + sn) in argv) {
                let account = {
                    wps_sid: argv['wps_sid-' + sn],
                    csrf: argv['csrf-' + sn],
                    tasks: argv['tasks-' + sn]
                }
                if (('tryrun-' + sn) in argv) {
                    account['tryrun'] = true
                }
                accounts.push(account)
            }
        }
    } else {
        accounts.push({
            ...argv
        })
    }
    console.log('总账户数', accounts.length)
    for (let account of accounts) {
        await require(path.join(__dirname, 'tasks', command, command)).start({
            cookies: {
                wps_sid: account.wps_sid,
                csrf: account.csrf,
            },
            options: {}
        }).catch(err => console.log("wps签到任务:", err.message))
        let hasTasks = await scheduler.hasWillTask(command, {
            tryrun: 'tryrun' in argv,
            taskKey: account.wps_sid
        })
        if (hasTasks) {
            scheduler.execTask(command, account.tasks).catch(err => console.log("wps签到任务:", err.message)).finally(() => {
                console.log('当前任务执行完毕！')
            })
        } else {
            console.log('暂无可执行任务！')
        }
    }
}