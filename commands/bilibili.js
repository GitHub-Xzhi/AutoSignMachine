
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
  var accounts = []
  if ('accountSn' in argv && argv.accountSn) {
    let accountSns = argv.accountSn.split(',')
    for (let sn of accountSns) {
      if (('username-' + sn) in argv) {
        let account = {
          cookies: argv['cookies-' + sn],
          NumberOfCoins: argv['NumberOfCoins-' + sn],
          CoinsForVideo: argv['CoinsForVideo-' + sn],
          SelectLike: argv['SelectLike-' + sn],
          username: argv['username-' + sn] + '',
          password: argv['password-' + sn] + '',
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
      cookies: argv['cookies'],
      NumberOfCoins: argv['NumberOfCoins'],
      CoinsForVideo: argv['CoinsForVideo'],
      SelectLike: argv['SelectLike'],
      username: argv['username'] + '',
      password: argv['password'] + '',
      tasks: argv['tasks']
    })
  }
  console.log('总账户数', accounts.length)
  for (let account of accounts) {
    await require(path.join(__dirname, 'tasks', command, command)).start({
      cookies: account.cookies,
      options: {
        NumberOfCoins: account.NumberOfCoins,
        CoinsForVideo: account.CoinsForVideo,
        SelectLike: account.SelectLike,
        username: account.username,
        password: account.password,
      }
    }).catch(err => console.log("bilibili签到任务:", err.message))
    let hasTasks = await scheduler.hasWillTask(command, {
      tryrun: 'tryrun' in argv,
      taskKey: account.username
    })
    if (hasTasks) {
      scheduler.execTask(command, account.tasks).catch(err => console.log("bilibili签到任务:", err.message)).finally(() => {
        console.log('当前任务执行完毕！')
      })
    } else {
      console.log('暂无可执行任务！')
    }
  }
}  