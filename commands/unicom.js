
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
  await require(path.join(__dirname, 'tasks', command, command)).start({
    cookies: argv.cookies,
    options: {
      appid: argv.appid,
      user: argv.user,
      password: argv.password
    }
  }).catch(err => console.log("unicom任务:", err.message))
  let hasTasks = await scheduler.hasWillTask(command)
  if(hasTasks){
    scheduler.execTask(command).catch(err => console.log("unicom任务:", err.message)).finally(() => {
      console.log('全部任务执行完毕！')
    })
  } else {
    console.log('暂无可执行任务！')
  }
}  