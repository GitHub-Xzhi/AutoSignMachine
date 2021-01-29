
const path = require('path')
const { scheduler } = require('../utils/scheduler')

exports.command = 'unicom'

exports.describe = 'unicom任务'

exports.builder = function (yargs) {
  return yargs
    .option('user', {
      describe: '用于登录的手机号码',
      default: '',
      type: 'string'
    })
    .option('password', {
      describe: '用于登录的账户密码',
      default: '',
      type: 'string'
    })
    .option('appid', {
      describe: 'appid',
      default: '',
      type: 'string'
    })
    .option('cookies', {
      describe: '签到cookies',
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
    let accountSns = (argv.accountSn + '').split(',')
    for (let sn of accountSns) {
      if (('user-' + sn) in argv) {
        let account = {
          cookies: argv['cookies-' + sn],
          user: argv['user-' + sn] + '',
          password: argv['password-' + sn] + '',
          appid: argv['appid-' + sn],
          tasks: argv['tasks-' + sn] || argv['tasks']
        }
        if (('tryrun-' + sn) in argv) {
          account['tryrun'] = true
        }
        accounts.push(account)
      }
    }
  } else {
    accounts.push({
      cookies: argv['cookies'],
      user: argv['user'] + '',
      password: argv['password'] + '',
      appid: argv['appid'],
      tasks: argv['tasks']
    })
  }
  console.log('总账户数', accounts.length)
  for (let account of accounts) {
    await require(path.join(__dirname, 'tasks', command, command)).start({
      cookies: account.cookies,
      options: {
        appid: account.appid,
        user: account.user,
        password: account.password
      }
    }).catch(err => console.log("unicom任务:", err))
    let hasTasks = await scheduler.hasWillTask(command, {
      tryrun: 'tryrun' in argv,
      taskKey: account.user
    })
    if (hasTasks) {
      scheduler.execTask(command, account.tasks).catch(err => console.log("unicom任务:", err)).finally(() => {
        console.log('当前任务执行完毕！')
      })
    } else {
      console.log('暂无可执行任务！')
    }
  }
}  