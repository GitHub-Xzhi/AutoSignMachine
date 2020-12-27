
const path = require('path')
const { scheduler } = require('../utils/scheduler')

exports.command = 'qqguanjia'

exports.describe = 'qqguanjia活动任务'

exports.builder = function (yargs) {
  return yargs
    .option('clientuin', {
      describe: 'Cookie中clientuin的值',
      default: '',
      type: 'string'
    })
    .option('clientkey', {
      describe: 'Cookie中clientkey的值',
      default: '',
      type: 'string'
    })
    .option('cookies', {
      describe: 'cookies',
      default: '类似值：uin=o***; skey=@***; RK=z***; ptcz=******',
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
      clientuin: argv.clientuin,
      clientkey: argv.clientkey
    }
  }).catch(err => console.log("qqguanjia活动任务:", err.message))
  let hasTasks = await scheduler.hasWillTask(command)
  if (hasTasks) {
    scheduler.execTask(command).catch(err => console.log("qqguanjia活动任务:", err.message)).finally(() => {
      console.log('全部任务执行完毕！')
    })
  } else {
    console.log('暂无可执行任务！')
  }
}  