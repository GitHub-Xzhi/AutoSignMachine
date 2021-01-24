const _request = require('../../../utils/request')
const { scheduler } = require('../../../utils/scheduler')
const { getCookies, saveCookies } = require('../../../utils/util')
var start = async (params) => {
  const { cookies, options } = params

  let init = async (request, savedCookies) => {
    let userInfo = await require('./init')(request, {
      ...params,
      cookies: savedCookies || cookies
    })
    return {
      request,
      data: {
        userInfo
      }
    }
  }
  let taskOption = {
    init
  }

  // 每日观看分享视频
  await scheduler.regTask('watchAndShareVideo', async (request) => {
    let dailyTaskStatus = await require('./dailyTaskStatus')(request)
    if (!dailyTaskStatus.watch || !dailyTaskStatus.share) {
      await require('./watchAndShareVideo')(request, dailyTaskStatus)
    } else {
      console.log('每日观看分享视频已完成')
    }
  }, taskOption)

  // 每日视频投币
  await scheduler.regTask('AddCoinsForVideo', async (request) => {
    let dailyTaskStatus = await require('./dailyTaskStatus')(request)
    if (!dailyTaskStatus.coins) {
      await require('./AddCoinsForVideo')(request, options)
    } else {
      console.log('每日视频投币已完成')
    }
  }, taskOption)

  // 漫画签到
  await scheduler.regTask('MangaSign', async (request) => {
    await require('./MangaSign')(request)
  }, taskOption)

  // 直播签到
  await scheduler.regTask('LiveSign', async (request) => {
    let SignInfo = await require('./LiveGetSignInfo')(request)
    if (!SignInfo.status) {
      await require('./LiveSign')(request)
    } else {
      console.log('今日已进行直播签到')
    }
  }, taskOption)

  // 银瓜子兑换硬币
  await scheduler.regTask('ExchangeSilver2Coin', async (request) => {
    let WalletInfo = await require('./myWallet')(request)
    if (WalletInfo.silver >= 700) {
      await require('./ExchangeSilver2Coin')(request)
    } else {
      console.log('银瓜子不足700无法兑换为硬币')
    }
  }, taskOption)

  // vip会员任务 - 年度大会员
  await scheduler.regTask('ReceiveVipPrivilege', async (request, data) => {
    const { userInfo } = data
    await require('./ReceiveVipPrivilege')(request, {
      ...options,
      userInfo
    })
  }, taskOption)

}
module.exports = {
  start
}