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
    cookies:savedCookies
  })

  // 每日签到积分
  await scheduler.regTask('dailysignin', async () => {
    result = await require('./integral').getSigninIntegral(request, options)
    let integralTotal = result.integralTotal
    result = await require('./integral').signTask(request, options)
    if (result.status === '0000') {
      if (result.data.todaySigned === '1') {
        result = await require('./integral').daySign(request, options)
        if (result.status === '0000') {
          console.log('积分签到成功+' + (result.data.newCoin - integralTotal) + '积分', '总积分:' + result.data.newCoin)
        } else {
          console.log('积分签到失败', result.msg)
        }
      } else {
        console.log('今日已积分签到')
      }
    } else {
      console.log('获取积分签到任务失败', result.msg)
    }
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

  // 每日免费抽奖
  await scheduler.regTask('dailylottery', async () => {
    await require('./integral').dailylottery(request, options)
  })

  // 每日娱乐中心打开签到
  await scheduler.regTask('gameSignin', async () => {
    await require('./integral').gameSignin(request, options)
  })

  // 每日沃之树
  await scheduler.regTask('dailywoTree', async () => {
    result = await require('./woTree').getStatus(request, options)
    await require('./woTree').takeFlow(request, {
      options,
      flowChangeList: result.flowChangeList
    })
    await require('./woTree').takePop(request, {
      options,
      popList: result.popList
    })
  })

  // await require('./integral').getflDetail(request, options)
  // await require('./integral').getTxDetail(request, options)
  // await require('./integral').getDxDetail(request, options)
  // await require('./integral').getCoins(request, options)

  // 每日评论积分
  await scheduler.regTask('dailycomment', async () => {
    // await require('./commentSystem').commentTask(request, options).catch(console.log)
  })
}
module.exports = {
  start
}