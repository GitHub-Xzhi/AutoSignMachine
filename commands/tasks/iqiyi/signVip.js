var crypto = require('crypto');
var moment = require('moment');
function k(e, t) {
  var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
    , n = a.split
    , c = void 0 === n ? "|" : n
    , r = a.sort
    , s = void 0 === r || r
    , o = a.splitSecretKey
    , i = void 0 !== o && o
    , l = s ? Object.keys(t).sort() : Object.keys(t)
    , u = l.map((function (e) {
      return "".concat(e, "=").concat(t[e])
    }
    )).join(c) + (i ? c : "") + e;
  return g(u)
}
function g(e) {
  return crypto.createHash("md5").update(e, "utf8").digest("hex")
}
function w() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
    , t = [];
  return Object.keys(e).forEach((function (a) {
    t.push("".concat(a, "=").concat(e[a]))
  }
  )),
    t.join("&")
}
var sign = {
  querySignInfo: async (axios) => {
    console.log('查询签到状态')
    let P00001 = undefined
    axios.defaults.headers.Cookie.split('; ').forEach(item => {
      if (item.indexOf('P00001') === 0) {
        P00001 = item.split("=").pop()
      }
    })
    var a = moment().format('YYYYMMDDHHmmss')
      , i = crypto.createHash("md5").update(a, "utf8").digest("hex")
      , n = {
        P00001: P00001,
        platform: "b6c13e26323c537d",
        lang: "zh_CN",
        app_lm: "cn",
        deviceID: "",
        version: "",
        messageId: "PCW_" + i
      };
    let { data } = await axios.request({
      headers: {
        "referer": "https://www.iqiyi.com",
        "origin": "https://www.iqiyi.com"
      },
      url: `https://tc.vip.iqiyi.com/taskCenter/task/querySignInfo`,
      method: 'get',
      params: n
    })
    if (data.code === 'A00000') {
      let { isSign, continueSignDaysSum, todayGrowth } = data.data
      console.log(isSign === 'yes' ? `今日已签到，连续签到${continueSignDaysSum}天，成长值+${todayGrowth}` : '今日还未签到')
      return isSign !== 'yes'
    } else {
      console.log(data.msg)
    }
  },
  vipSign: async (axios) => {
    console.log('进行VIP签到')
    let P00001 = undefined
    let QC005 = undefined
    axios.defaults.headers.Cookie.split('; ').forEach(item => {
      if (item.indexOf('P00001') === 0) {
        P00001 = item.split("=").pop()
      }
      if (item.indexOf('QC005') === 0) {
        QC005 = item.split("=").pop()
      }
    })
    var a = {
      P00001: P00001,
      app_lm: 'cn',
      deviceID: QC005,
      fv: 'bed99b2cf5722bfe',
      lang: 'zh_CN',
      platform: 'b6c13e26323c537d',
      version: ''
    }
    let res = await axios.request({
      headers: {
        "referer": "https://www.iqiyi.com",
        "origin": "https://www.iqiyi.com"
      },
      url: "".concat("https://tc.vip.iqiyi.com/taskCenter/task/userSign", "?").concat(w(a)),
      method: 'post'
    })
    data = res.data.data
    if (res.data.code === 'A00000') {
      console.log('成长值签到：', "签到成功！成长值+" + data.rewardMap.growth + "点，积分+" + data.rewardMap.integral + "点！", res.data.msg, '已连续签到：', data.signReached, '天')
    } else {
      console.log('成长值签到：', res.data.msg)
      if (data) {
        console.log('已连续签到：', data.continueSignDaysSum, '天')
      }
    }
  }
}

module.exports = sign