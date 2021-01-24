
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
    var command = argv._[0]
    var accounts = []
    if ('accountSn' in argv && argv.accountSn) {
        let accountSns = argv.accountSn.split(',')
        for (let sn of accountSns) {
            if (('user-' + sn) in argv) {
                let account = {
                    cookies: argv['cookies-' + sn],
                    user: argv['user-' + sn] + '',
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
            cookies: account.cookies,
            options: {}
        }).catch(err => console.log("10086签到任务:", err.message))
        let hasTasks = await scheduler.hasWillTask(command, {
            tryrun: 'tryrun' in argv,
            taskKey: account.user
        })
        if (hasTasks) {
            scheduler.execTask(command, account.tasks).catch(err => console.log("10086签到任务:", err.message)).finally(() => {
                console.log('全部任务执行完毕！')
            })
        } else {
            console.log('暂无可执行任务！')
        }
    }
}