
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
  await require(path.join(__dirname, 'tasks', command, command)).start({
    cookies: {
      htVD_2132_auth: argv.htVD_2132_auth,
      htVD_2132_saltkey: argv.htVD_2132_saltkey
    },
    options: {}
  }).catch(err => console.log("52pojie签到任务:", err.message))
  let hasTasks = await scheduler.hasWillTask(command, {
    tryrun: 'tryrun' in argv,
    taskKey: argv.htVD_2132_auth
  })
  if (hasTasks) {
    scheduler.execTask(command, argv.tasks).catch(err => console.log("52pojie签到任务:", err.message)).finally(() => {
      console.log('全部任务执行完毕！')
    })
  } else {
    console.log('暂无可执行任务！')
  }
}  