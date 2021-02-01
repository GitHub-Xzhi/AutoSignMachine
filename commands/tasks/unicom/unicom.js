const { scheduler } = require('../../../utils/scheduler')
const { getCookies, saveCookies } = require('../../../utils/util')
const _request = require('../../../utils/request')

var start = async (params) => {
  const { cookies, options } = params

  let init = async (request, savedCookies) => {
    await require('./init')(request, {
      ...params,
      cookies: savedCookies || cookies
    })
    return {
      request
    }
  }
  let taskOption = {
    init
  }

  // 每日签到积分
  await scheduler.regTask('dailysignin', async (request) => {
    await require('./dailysignin').doTask(request, options)
    await require('./integral').addFlow(request, options)
  }, taskOption)

  // 冬奥积分活动 20201231
  await scheduler.regTask('winterTwo', async (request) => {
    await require('./integral').winterTwoGetIntegral(request, options)
    await require('./integral').winterTwoStatus(request, options)
  }, taskOption)

  // 每日定向积分 20201231
  await scheduler.regTask('dxIntegralEveryDay', async (request) => {
    await require('./integral').dxIntegralEveryDay(request, options)
  }, taskOption)

  // 每日游戏楼层宝箱
  await scheduler.regTask('dailygamebox', async (request) => {
    await require('./integral').gamebox(request, options)
  }, taskOption)

  // 每日抽奖
  await scheduler.regTask('dailylotteryintegral', async (request) => {
    await require('./dailylotteryintegral').doTask(request, options)
  }, taskOption)

  // 首页-游戏-娱乐中心-沃之树
  await scheduler.regTask('dailywoTree', async (request) => {
    await require('./woTree').doTask(request, options)
  }, taskOption)

  await scheduler.regTask('dailyBookRead', async (request) => {
    // 首页-小说-阅读越有礼打卡赢话费
    await require('./dailyBookRead').doTask(request, options)
    await require('./dailyVideoBook').doTask(request, options)
  }, taskOption)

  // 首页-小说-读满10章赢好礼
  await scheduler.regTask('dailyBookRead10doDraw', async (request) => {
    // 首页-小说-读满10章赢好礼
    await require('./dailyVideoBook').read10doDraw(request, options)
    // 首页-小说-读满10章赢好礼-看视频领2积分
    await require('./dailyVideoBook').read10doDrawLookVideoDouble(request, options)
    // 首页-签到有礼-免流量得福利-3积分天天拿(阅读打卡)
    await require('./dailyVideoBook').giftBoints(request, options)
  }, taskOption)

  await scheduler.regTask('dailyBookLuckdraw', async (request) => {
    // 首页-小说-阅读福利抽大奖
    await require('./dailyBookLuckdraw').doTask(request, options)
  }, taskOption)

  // 首页-签到有礼-免费领-浏览领积分
  await scheduler.regTask('dailyLiuLan', async (request) => {
    await require('./dailyTTliulan').doTask(request, options)
  }, taskOption)

  // 首页-签到有礼-免费拿-看视频夺宝
  // 易出现本次操作需要进行验证，暂时注释
  // await scheduler.regTask('dailyVideoFreeGoods', async (request) => {
  //   await require('./dailyVideoFreeGoods').doTask(request, options)
  // }, {
  //   isCircle: true,
  //   startTime: 10 * 3600,
  //   intervalTime: 4 * 3600
  // })

  // 首页-签到有礼-免费抽-抓OPPO手机
  await scheduler.regTask('dailyGrabdollPage', async (request) => {
    await require('./dailyGrabdollPage').doTask(request, options)
  }, taskOption)

  // 首页-签到有礼-免费抽-拿666积分-豪礼大派送抽奖
  await scheduler.regTask('jflottery', async (request) => {
    await require('./jflottery').timesDraw(request, options)
  }, taskOption)

  // 首页-签到有礼-免费抽-拿苹果iPad Pro(摇一摇)
  await scheduler.regTask('dailyYYY', async (request) => {
    await require('./dailyYYY').doTask(request, options)
  }, taskOption)

  // 首页-签到有礼-免费抽-华为mate40pro(刮刮乐)
  await scheduler.regTask('dailyVideoScratchcard', async (request) => {
    await require('./dailyVideoScratchcard').doTask(request, options)
  }, taskOption)

  // 首页-签到有礼-免费抽-赢三星Galaxy Z(试试手气)
  await scheduler.regTask('dailyCheapStorePage', async (request) => {
    await require('./dailyCheapStorePage').doTask(request, options)
  }, {
    isCircle: true,
    intervalTime: 4 * 3600,
    ...taskOption
  })

  // 首页-签到有礼-免费抽-拆华为Pad(去抽奖)
  await scheduler.regTask('dailyLKMH', async (request) => {
    await require('./dailyLKMH').doTask(request, options)
  }, taskOption)

  // 首页-签到有礼-免费抽-拿iPhone12(摇一摇)
  await scheduler.regTask('dailyYYQ', async (request) => {
    await require('./dailyYYQ').doTask(request, options)
  }, taskOption)

  // 首页-签到有礼-免费抽-赢Apple Watch(去抽奖)
  await scheduler.regTask('dailyTurntablePage', async (request) => {
    await require('./dailyTurntablePage').doTask(request, options)
  }, taskOption)

  // 首页-签到有礼-赚更多福利-看视频奖励5积分
  await scheduler.regTask('dailyVideo', async (request) => {
    await require('./dailyVideo').doTask(request, options)
  }, taskOption)

  // 首页-签到有礼-赚更多福利-天天抽好礼
  await scheduler.regTask('dailylottery', async (request) => {
    await require('./dailylottery').doTask(request, options)
  }, taskOption)

  // 首页-游戏-娱乐中心-每日打卡
  await scheduler.regTask('producGameSignin', async (request) => {
    await require('./producGame').gameSignin(request, options)
    await require('./producGame').gameBox(request, options)
  }, taskOption)

  // 首页-游戏-娱乐中心-天天领取3G流量包
  await scheduler.regTask('dailygameflow', async (request) => {
    await require('./producGame').doGameFlowTask(request, options)
  }, taskOption)

  // 首页-积分查询-游戏任务
  await scheduler.regTask('dailygameIntegral', async (request) => {
    await require('./producGame').doGameIntegralTask(request, options)
  }, taskOption)

  // 首页-知识-限时免费（连续7天阶梯激励）
  await scheduler.regTask('dailyCourse', async (request) => {
    await require('./dailyCourse').doTask(request, options)
  }, {
    ...taskOption,
    startTime: 9 * 3600
  })

  // await require('./integral').getflDetail(request, options)
  // await require('./integral').getTxDetail(request, options)
  // await require('./integral').getDxDetail(request, options)
  // await require('./integral').getCoins(request, options)

  // 每日评论积分
  await scheduler.regTask('dailycomment', async (request) => {
    await require('./commentSystem').commentTask(request, options).catch(console.log)
  }, taskOption)

  // 首页-游戏-娱乐中心-每日打卡-完成今日任务(200m)
  await scheduler.regTask('todayDailyTask', async (request) => {
    await require('./producGame').doTodayDailyTask(request, options)
  }, {
    ...taskOption,
    startTime: 20 * 3600
  })

  // 首页-签到有礼-居家娱乐馆
  await scheduler.regTask('gameYearBox', async (request) => {
    await require('./gameYearBox').doTask(request, options)
  }, {
    ...taskOption,
    startTime: 20 * 3600
  })

  // 首页-牛气-秒杀抢兑
  await scheduler.regTask('NiujieSpikePrize', async (request) => {
    await require('./Niujie').spikePrize(request, options)
  }, {
    ...taskOption,
    startTime: 9.6 * 3600,
    ignoreRelay: true
  })

  // 首页-牛气-转盘抽奖
  await scheduler.regTask('NiujieTask', async (request) => {
    await require('./Niujie').doTask(request, options)
  }, taskOption)


  // 首页-牛气-场馆领牛气
  await scheduler.regTask('NiujieReceiveCalf', async (request) => {
    await require('./Niujie').receiveCalf(request, options)
  }, {
    isCircle: true,
    intervalTime: 1 * 3600,
    startTime: 1,
    ...taskOption
  })
}
module.exports = {
  start
}