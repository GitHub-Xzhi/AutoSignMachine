const { scheduler } = require('../../../utils/scheduler')
const { getCookies, saveCookies } = require('../../../utils/util')
const _request = require('../../../utils/request')

var start = async (params) => {
  const { cookies, options } = params

  let savedCookies = await getCookies('unicom_' + options.user)
  if (!savedCookies) {
    savedCookies = cookies
  }
  const request = _request(savedCookies)

  await require('./init')(request, {
    ...params,
    cookies: savedCookies
  })

  // 每日签到积分
  await scheduler.regTask('dailysignin', async () => {
    await require('./dailysignin').doTask(request, options)
  })

  // 冬奥积分活动 20201231
  await scheduler.regTask('winterTwo', async () => {
    await require('./integral').winterTwoGetIntegral(request, options)
    await require('./integral').winterTwoStatus(request, options)
  })

  // 每日定向积分 20201231
  await scheduler.regTask('dxIntegralEveryDay', async () => {
    await require('./integral').dxIntegralEveryDay(request, options)
  })

  // 每日游戏楼层宝箱
  await scheduler.regTask('dailygamebox', async () => {
    await require('./integral').gamebox(request, options)
  })

  // 每日抽奖
  await scheduler.regTask('dailylotteryintegral', async () => {
    await require('./dailylotteryintegral').doTask(request, options)
  })

  // 首页-游戏-娱乐中心-沃之树
  await scheduler.regTask('dailywoTree', async () => {
    // 沃之树 浇水
    await require('./woTree').water(request, options)
    let i = 2
    do {
      // 普通 - 看视频 似乎是分开的两次
      result = await require('./woTree').getStatus(request, options)
      await require('./woTree').takeFlow(request, {
        options,
        flowChangeList: result.flowChangeList
      })
    } while (i--)
    await require('./woTree').takePop(request, {
      options,
      popList: result.popList
    })
  })

  await scheduler.regTask('dailyBookRead', async () => {
    // 首页-小说-阅读越有礼打卡赢话费
    await require('./dailyBookRead').doTask(request, options)
    await require('./dailyVideoBook').doTask(request, options)
  })

  // 首页-小说-读满10章赢好礼
  await scheduler.regTask('dailyBookRead10doDraw', async () => {
    // 首页-小说-读满10章赢好礼
    await require('./dailyVideoBook').read10doDraw(request, options)
    // 首页-小说-读满10章赢好礼-看视频领2积分
    await require('./dailyVideoBook').read10doDrawLookVideoDouble(request, options)
    // 首页-签到有礼-免流量得福利-3积分天天拿(阅读打卡)
    await require('./dailyVideoBook').giftBoints(request, options)
  })

  await scheduler.regTask('dailyBookLuckdraw', async () => {
    // 首页-小说-阅读福利抽大奖
    await require('./dailyBookLuckdraw').doTask(request, options)
  })

  // 首页-签到有礼-免费领-浏览领积分
  await scheduler.regTask('dailyLiuLan', async () => {
    await require('./dailyTTliulan').doTask(request, options)
  })

  // 首页-签到有礼-免费拿-看视频夺宝
  // 易出现本次操作需要进行验证，暂时注释
  // await scheduler.regTask('dailyVideoFreeGoods', async () => {
  //   await require('./dailyVideoFreeGoods').doTask(request, options)
  // }, {
  //   isCircle: true,
  //   startTime: 10 * 3600,
  //   intervalTime: 4 * 3600
  // })

  // 首页-签到有礼-免费抽-拿666积分-豪礼大派送抽奖
  await scheduler.regTask('jflottery', async () => {
    await require('./jflottery').timesDraw(request, options)
  })

  // 首页-签到有礼-免费抽-拿苹果iPad Pro(摇一摇)
  await scheduler.regTask('dailyYYY', async () => {
    await require('./dailyYYY').doTask(request, options)
  })

  // 首页-签到有礼-免费抽-华为mate40pro(刮刮乐)
  await scheduler.regTask('dailyVideoScratchcard', async () => {
    await require('./dailyVideoScratchcard').doTask(request, options)
  })

  // 首页-签到有礼-免费抽-赢三星Galaxy Z(试试手气)
  await scheduler.regTask('dailyCheapStorePage', async () => {
    await require('./dailyCheapStorePage').doTask(request, options)
  }, {
    isCircle: true,
    intervalTime: 4 * 3600
  })

  // 首页-签到有礼-免费抽-拆华为Pad(去抽奖)
  await scheduler.regTask('dailyLKMH', async () => {
    await require('./dailyLKMH').doTask(request, options)
  })

  // 首页-签到有礼-免费抽-拿iPhone12(摇一摇)
  await scheduler.regTask('dailyYYQ', async () => {
    await require('./dailyYYQ').doTask(request, options)
  })

  // 首页-签到有礼-免费抽-赢Apple Watch(去抽奖)
  await scheduler.regTask('dailyTurntablePage', async () => {
    await require('./dailyTurntablePage').doTask(request, options)
  })

  // 首页-签到有礼-赚更多福利-看视频奖励5积分
  await scheduler.regTask('dailyVideo', async () => {
    await require('./dailyVideo').doTask(request, options)
  })

  // 首页-签到有礼-赚更多福利-天天抽好礼
  await scheduler.regTask('dailylottery', async () => {
    await require('./dailylottery').doTask(request, options)
  })

  // 首页-游戏-娱乐中心-每日打卡
  await scheduler.regTask('producGame', async () => {
    await require('./producGame').gameSignin(request, options)
  })

  // 首页-游戏-娱乐中心-天天领取3G流量包
  await scheduler.regTask('dailygameflow', async () => {
    await require('./producGame').doGameFlowTask(request, options)
  })

  // 首页-积分查询-游戏任务
  await scheduler.regTask('dailygameIntegral', async () => {
    await require('./producGame').doGameIntegralTask(request, options)
  })

  // await require('./integral').getflDetail(request, options)
  // await require('./integral').getTxDetail(request, options)
  // await require('./integral').getDxDetail(request, options)
  // await require('./integral').getCoins(request, options)

  // 每日评论积分
  await scheduler.regTask('dailycomment', async () => {
    await require('./commentSystem').commentTask(request, options).catch(console.log)
  })
}
module.exports = {
  start
}