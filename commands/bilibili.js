
const path = require('path')
const { scheduler } = require('../utils/scheduler')

exports.command = 'bilibili'

exports.describe = 'bilibili签到任务'

exports.builder = function (yargs) {
  return yargs
    .option('cookies', {
      describe: 'cookies',
      type: 'string'
    })
    .option('username', {
      describe: '登陆账号',
      type: 'string'
    })
    .option('password', {
      describe: '登陆密码',
      type: 'string'
    })
    .option('NumberOfCoins', {
      describe: '视频投币的目标数量',
      default: 5,
      type: 'number'
    })
    .option('CoinsForVideo', {
      describe: '每个视频投币数量，最多2',
      default: 1,
      type: 'number'
    })
    .option('SelectLike', {
      describe: '视频投币时是否点赞',
      default: true,
      type: 'boolean'
    })
    .option('DayOfReceiveVipPrivilege', {
      describe: '指定的某一天取得会员权益',
      default: 1,
      type: 'number'
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
      NumberOfCoins: argv.NumberOfCoins,
      CoinsForVideo: argv.CoinsForVideo,
      SelectLike: argv.SelectLike,
      username: argv.username,
      password: argv.password,
    }
  }).catch(err => console.log("bilibili签到任务:", err.message))
  let hasTasks = await scheduler.hasWillTask(command)
  if (hasTasks) {
    scheduler.execTask(command).catch(err => console.log("bilibili签到任务:", err.message)).finally(() => {
      console.log('全部任务执行完毕！')
    })
  } else {
    console.log('暂无可执行任务！')
  }
}  