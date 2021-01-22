var crypto = require('crypto');
function k (e, t) {
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
function g (e) {
  return crypto.createHash("md5").update(e, "utf8").digest("hex")
}
function w () {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
    , t = [];
  return Object.keys(e).forEach((function (a) {
    t.push("".concat(a, "=").concat(e[a]))
  }
  )),
    t.join("&")
}
module.exports = async (axios) => {
  console.log('普通用户积分签到')

  let P00001 = undefined
  let P00PRU = undefined
  let dfp = undefined
  let user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
  axios.defaults.headers.Cookie.split('; ').forEach(item => {
    if (item.indexOf('P00001') === 0) {
      P00001 = item.split("=").pop()
    }
    if (item.indexOf('P00PRU') === 0) {
      P00PRU = item.split("=").pop()
    }
    if (item.indexOf('_dfp') === 0) {
      dfp = item.split("=").pop().split("@")[0]
    }
  })
  var a = {
    agenttype: "1",
    agentversion: "0",
    appKey: "basic_pcw",
    appver: "0",
    authCookie: P00001,
    channelCode: "sign_pcw",
    dfp: dfp,
    scoreType: "1",
    srcplatform: "1",
    typeCode: "point",
    userId: P00PRU,
    user_agent: user_agent,
    verticalCode: "iQIYI"
  }
  var c = k("UKobMjDMsDoScuWOfp6F", a, {
    split: "|",
    sort: !0,
    splitSecretKey: !0
  })
  let res = await axios.request({
    headers: {
      "referer": "https://www.iqiyi.com",
      "origin": "https://www.iqiyi.com"
    },
    url: "".concat("https://community.iqiyi.com/openApi/score/add", "?").concat(w(a), "&sign=").concat(c),
    method: 'post'
  })
  let result = res.data

  if (result.code === 'A00000') {
    let data = result.data[0]
    if (result.code === 'A00000') {
      if (data.code === 'A0000') {
        console.log('积分签到：', '积分变动增加' + data.score)
      } else {
        console.log('积分签到：', data.message)
      }
    } else {
      console.log('积分签到：', result.message)
    }
  } else {
    console.log('积分签到：', result.message)
  }
}