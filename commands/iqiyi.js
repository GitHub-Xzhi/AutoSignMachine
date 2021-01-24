
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
  await require(path.join(__dirname, 'tasks', command, command)).start({
    cookies: {
      P00001: argv.P00001,
      P00003: argv.P00PRU,
      P00PRU: argv.P00PRU,
      QC005: argv.QC005,
      _dfp: argv.dfp
    },
    options: {}
  }).catch(err => console.log("iqiyi签到任务:", err.message))
  let hasTasks = await scheduler.hasWillTask(command, 'tryrun' in argv)
  if(hasTasks){
    scheduler.execTask(command, argv.tasks).catch(err => console.log("iqiyi签到任务:", err.message)).finally(() => {
      console.log('全部任务执行完毕！')
    })
  } else {
    console.log('暂无可执行任务！')
  }
}  