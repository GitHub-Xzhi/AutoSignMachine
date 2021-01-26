
const path = require('path')
const { scheduler } = require('../utils/scheduler')

exports.command = 'iqiyi'

exports.describe = 'iqiyi签到任务'

exports.builder = function (yargs) {
  return yargs
    .option('P00001', {
      describe: 'Cookie中P00001的值',
      default: '',
      type: 'string'
    })
    .option('P00PRU', {
      describe: 'Cookie中P00PRU的值',
      default: '',
      type: 'string'
    })
    .option('dfp', {
      describe: 'Cookie中_dfp的值',
      default: '',
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
      if (('P00PRU-' + sn) in argv) {
        let account = {
          P00001: argv['P00001-' + sn],
          P00003: argv['P00003-' + sn],
          P00PRU: argv['P00PRU-' + sn] + '',
          QC005: argv['QC005-' + sn],
          dfp: argv['dfp-' + sn],
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
      P00001: argv['P00001'],
      P00003: argv['P00003'],
      P00PRU: argv['P00PRU'] + '',
      QC005: argv['QC005'],
      dfp: argv['dfp'],
      tasks: argv['tasks']
    })
  }
  console.log('总账户数', accounts.length)
  for (let account of accounts) {
    await require(path.join(__dirname, 'tasks', command, command)).start({
      cookies: {
        P00001: account.P00001,
        P00003: account.P00003,
        P00PRU: account.P00PRU,
        QC005: account.QC005,
        _dfp: account.dfp
      },
      options: {}
    }).catch(err => console.log("iqiyi签到任务:", err.message))
    let hasTasks = await scheduler.hasWillTask(command, {
      tryrun: 'tryrun' in argv,
      taskKey: account.P00PRU
    })
    if (hasTasks) {
      scheduler.execTask(command, account.tasks).catch(err => console.log("iqiyi签到任务:", err.message)).finally(() => {
        console.log('当前任务执行完毕！')
      })
    } else {
      console.log('暂无可执行任务！')
    }
  }
}  