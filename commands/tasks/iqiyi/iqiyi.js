const _request = require('../../../utils/request')
const {scheduler} = require('../../../utils/scheduler')
var start = async (params) => {
  const { cookies, options } = params
  if (!('P00001' in cookies) || !cookies['P00001']) {
    throw new Error("需要提供P00001参数")
  }
  if (!('P00PRU' in cookies) || !cookies['P00PRU']) {
    throw new Error("需要提供P00001参数")
  }
  if (!('_dfp' in cookies) || !cookies['_dfp']) {
    throw new Error("需要提供_dfp参数")
  }

  const request = _request(cookies, false)

  let userinfo = await require('./init')(request)

  // 普通用户积分签到
  await scheduler.regTask('signPoint', async () => {
    await require('./signPoint')(request)
  })

  // vip 用户成长值签到
  if (userinfo.vipInfo.status === '1') {
    // vip签到任务
    await scheduler.regTask('signVip', async () => {
      await require('./signVip')(request)
    })
    // 浏览会员俱乐部任务
    await scheduler.regTask('dailyBrowserClub', async () => {
      await require('./dailyBrowserClub')(request)
    })
    // 访问热点首页
    await scheduler.regTask('dailyFeed', async () => {
      await require('./dailyFeed')(request)
    })

    // 每日观看视频30分钟3次
    await scheduler.regTask('dailyWatchVideo', async () => {
      await require('./dailyWatchVideo').reportPlayTime(request)
    })
  } else {
    console.log('非vip会员跳过vip签到任务')
  }

}
module.exports = {
  start
}