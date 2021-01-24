const _request = require('../../../utils/request')
const { scheduler } = require('../../../utils/scheduler')
var start = async (params) => {
  const { cookies, options } = params

  let init = async (request, savedCookies) => {
    if (!savedCookies) {
      if (!('P00001' in cookies) || !cookies['P00001']) {
        throw new Error("需要提供P00001参数")
      }
      if (!('P00PRU' in cookies) || !cookies['P00PRU']) {
        throw new Error("需要提供P00001参数")
      }
      if (!('_dfp' in cookies) || !cookies['_dfp']) {
        throw new Error("需要提供_dfp参数")
      }
      return {
        request: _request(cookies)
      }
    } else {
      return {
        request
      }
    }
  }
  let taskOption = {
    init
  }

  // 普通用户积分签到
  await scheduler.regTask('signPoint', async (request) => {
    await require('./signPoint')(request)
  }, taskOption)

  // 日常任务
  await scheduler.regTask('dailyTask', async (request) => {
    let { tasks } = await require('./dailyTask').getTasks(request)
    let { daily } = tasks
    await require('./dailyTask').joinTasks(request, daily)
    await require('./dailyTask').completeTasks(request, daily)
  }, taskOption)

  // vip 用户成长值签到

  // vip签到任务
  await scheduler.regTask('signVip', async (request) => {
    let userinfo = await require('./init')(request)
    if (userinfo.vipInfo.status === '1') {
      let isNotSign = await require('./signVip').querySignInfo(request)
      if (isNotSign) {
        await require('./signVip').vipSign(request)
      }
    } else {
      console.log('非vip会员跳过vip签到任务')
    }
  }, taskOption)

  // 浏览会员俱乐部任务
  await scheduler.regTask('dailyBrowserClub', async (request) => {
    let userinfo = await require('./init')(request)
    if (userinfo.vipInfo.status === '1') {
      await require('./dailyBrowserClub')(request)
    } else {
      console.log('非vip会员跳过浏览会员俱乐部任务')
    }
  }, taskOption)

  // 访问热点首页
  await scheduler.regTask('dailyFeed', async (request) => {
    let userinfo = await require('./init')(request)
    if (userinfo.vipInfo.status === '1') {
      await require('./dailyFeed')(request)
    } else {
      console.log('非vip会员跳过访问热点首页')
    }
  }, taskOption)

  // 每日观看视频30分钟3次
  await scheduler.regTask('dailyWatchVideo', async (request) => {
    let userinfo = await require('./init')(request)
    if (userinfo.vipInfo.status === '1') {
      // await require('./dailyWatchVideo').reportPlayTime(request)
    } else {
      console.log('非vip会员跳过每日观看视频30分钟3次')
    }
  }, taskOption)


}
module.exports = {
  start
}