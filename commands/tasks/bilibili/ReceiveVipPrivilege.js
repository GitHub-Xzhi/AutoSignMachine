const dayjs = require('dayjs')

var ReceiveVipPrivilege = async (axios, type) => {
  let bili_jct = undefined
  axios.defaults.headers.Cookie.split('; ').forEach(item => {
    if (item.indexOf('bili_jct') === 0) {
      bili_jct = item.split("=").pop()
    }
  })
  return new Promise((resolve, reject) => {
    axios.request({
      headers:{
        "referer": "https://www.bilibili.com",
        "origin": "https://www.bilibili.com",
      },
      url: `https://api.bilibili.com/x/vip/privilege/receive?type=${type}&csrf=${bili_jct}`,
      method: 'post'
    }).then(res => {
      if (res.data.code == 0) {
        if (type == 1) {
          console.log("领取年度大会员每月赠送的B币券成功");
        } else if (type == 2) {
          console.log("领取大会员福利/权益成功");
        }
      } else {
        console.log("领取年度大会员每月赠送的B币券/大会员福利失败，原因：%s", res.data.message);
      }
      resolve(res.data)
    }).catch(err => {
      resolve()
    })
  })
}

module.exports = async (axios, options) => {
  const {userInfo, DayOfReceiveVipPrivilege} = options
  if (userInfo.vipStatus) {
    if (DayOfReceiveVipPrivilege != 0) {
      let day = dayjs().date()
      if (day == DayOfReceiveVipPrivilege) {
        if (userInfo.vipType == 2) {
          await ReceiveVipPrivilege(axios, 1)
          await ReceiveVipPrivilege(axios, 2)
        } else {
          console.log("普通会员和月度大会员每月不赠送B币券，所以不需要领取权益喽");
        }
      } else {
        console.log("目标领取日期为%s号，今天是%s号，跳过领取任务", DayOfReceiveVipPrivilege, day);
      }
    } else {
      console.log("已配置为不进行自动领取会员权益，跳过领取任务");
    }
  }
}