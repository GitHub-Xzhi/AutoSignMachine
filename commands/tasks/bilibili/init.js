const EveryDayExp = 5+5+50+5
module.exports = (axios) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: 'https://api.bilibili.com/x/web-interface/nav'
    }).then(res => {
      let result = res.data
      if (result.code !== 0 || !result.data.isLogin) {
        throw new Error(result.message)
      } else {
        let userInfo = result.data
        console.log(`获取用户状态成功 用户名：%s，硬币余额：%s，当前等级Lv%s，经验值为：%s，下级经验值为：%s`, userInfo.uname.substr(0, 2) + "********", userInfo.money,userInfo.level_info.current_level, userInfo.level_info.current_exp, userInfo.level_info.next_exp)
        if (userInfo.level_info.current_level < 6) {
          console.log(`距离升级到Lv%s还有: %s天`, userInfo.level_info.current_level + 1, new Number((userInfo.level_info.next_exp - userInfo.level_info.current_exp) / EveryDayExp).toFixed(2))
        }
        resolve(userInfo)
      }
    }).catch(reject)
  })
}