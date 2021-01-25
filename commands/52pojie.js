
const path = require('path')
const { scheduler } = require('../utils/scheduler')

exports.command = '52pojie'

exports.describe = '52pojie签到任务'

exports.builder = function (yargs) {
  return yargs
    .option('htVD_2132_auth', {
      describe: 'cookie项htVD_2132_auth的值',
      type: 'string'
    })
    .option('htVD_2132_saltkey', {
      describe: 'cookie项htVD_2132_saltkey的值',
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
      if (('htVD_2132_auth-' + sn) in argv) {
        let account = {
          htVD_2132_auth: argv['htVD_2132_auth-' + sn],
          htVD_2132_saltkey: argv['htVD_2132_saltkey-' + sn],
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
        htVD_2132_auth: account.htVD_2132_auth,
        htVD_2132_saltkey: account.htVD_2132_saltkey
      },
      options: {}
    }).catch(err => console.log("52pojie签到任务:", err.message))
    let hasTasks = await scheduler.hasWillTask(command, {
      tryrun: 'tryrun' in argv,
      taskKey: account.htVD_2132_auth
    })
    if (hasTasks) {
      scheduler.execTask(command, account.tasks).catch(err => console.log("52pojie签到任务:", err.message)).finally(() => {
        console.log('当前任务执行完毕！')
      })
    } else {
      console.log('暂无可执行任务！')
    }
  }
}  