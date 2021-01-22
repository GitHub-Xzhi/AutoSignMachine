const EveryDayExp = 5 + 5 + 50 + 5

var checkInfo = async (axios) => {
  const res = await axios.request({
    headers: {
      "referer": "https://passport.bilibili.com/",
      "origin": "https://passport.bilibili.com",
    },
    url: 'https://api.bilibili.com/x/web-interface/nav',
    method: 'get'
  })
  return res
}
module.exports = async (axios, params) => {
  const { options, cookies } = params

  let result

  try {
    let res = await checkInfo(axios)
    result = res.data
  } catch (err) {
    console.log('获取信息失败')
  }

  // 重要：密码账户登录易出现 您的账号存在高危异常行为，为了您的账号安全，请验证手机号后登录帐号 提示，建议使用cookies
  if (Object.prototype.toString.call(result) !== '[object Object]' || !result || result.code !== 0) {
    console.log('cookies凭据访问失败，将使用账户密码登录')
    if (options['username']) {
      if (!('password' in options) || !options['password']) {
        throw new Error("需要提供登陆密码")
      }
    } else if (!cookies) {
      throw new Error("需要提供登录信息，使用密码账号或者cookies")
    }
    await require('./account').loginByPassword(axios, options)
    res = await checkInfo(axios)
    result = res.data
  }

  if (result.code !== 0 || !result.data.isLogin) {
    throw new Error(result.message)
  } else {
    let userInfo = result.data
    console.log(`获取用户状态成功 用户名：%s，硬币余额：%s，当前等级Lv%s，经验值为：%s，下级经验值为：%s`, userInfo.uname.substr(0, 2) + "********", userInfo.money, userInfo.level_info.current_level, userInfo.level_info.current_exp, userInfo.level_info.next_exp)
    if (userInfo.level_info.current_level < 6) {
      console.log(`距离升级到Lv%s还有: %s天`, userInfo.level_info.current_level + 1, new Number((userInfo.level_info.next_exp - userInfo.level_info.current_exp) / EveryDayExp).toFixed(2))
    }
    return userInfo
  }
}