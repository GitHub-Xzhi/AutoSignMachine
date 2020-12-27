const _request = require('../../../utils/request')
const { scheduler } = require('../../../utils/scheduler')
var start = async (params) => {
  const { cookies, options } = params
  if (options.clientuin && options.clientkey) {
    let cookiejar = await require('./gamehelper')(request, options)
    let cookiesJson = cookiejar.toJSON()
    let skey = cookiesJson.cookies.find(i => i.key == 'skey')
    let uin = cookiesJson.cookies.find(i => i.key == 'uin')
    cookies = {
      skey: skey ? skey.value : "",
      uin: uin ? uin.value : ''
    }
  } else if (!cookies) {
    throw new Error("需要提供登录信息clientuin/clientkey, 或者cookies")
  }
  const request = _request(cookies)
  // 腾讯管家-游戏助手-每日登录抽奖
  // await scheduler.regTask('gamehelper', async () => {
  // 获取指定actId得剩余抽奖机会
  await require('./lottery').getLotteryChance(request)
  // 获取指定actId的奖品列表
  await require('./lottery').getGiftList(request)
  // })

}
module.exports = {
  start
}