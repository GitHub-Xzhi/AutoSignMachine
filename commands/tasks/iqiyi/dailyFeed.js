var crypto = require('crypto');
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

module.exports = async (axios) => {
  console.log('访问热点首页')

  let { config } = await axios.request({
    headers: {
      "referer": "https://www.iqiyi.com",
      "origin": "https://www.iqiyi.com"
    },
    url: "https://www.iqiyi.com/feed/?vfrm=pcw_my&vfrmblk=body_jf&vfrmrst=702091_jf_rd"
  })

  let user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
  
  let cookiesJson = config.jar.toJSON()
  let P00001 = cookiesJson.cookies.find(i => i.key == 'P00001')
  P00001 = P00001.value
  let P00PRU = cookiesJson.cookies.find(i => i.key == 'P00PRU')
  P00PRU = P00PRU.value
  let dfp = cookiesJson.cookies.find(i => i.key == '_dfp')
  dfp = dfp.value.split("@")[0]

  var a = {
    'agenttype': '1',
    'agentversion': '0',
    'appKey': 'basic_pcw',
    'appver': '0',
    'authCookie': P00001,
    'channelCode': 'paopao_pcw',
    'dfp': dfp,
    'scoreType': '1',
    'srcplatform': '1',
    'typeCode': 'point',
    'userId': P00PRU,
    'user_agent': user_agent,
    'verticalCode': 'iQIYI'
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
    url: "".concat("https://community.iqiyi.com/openApi/task/complete", "?").concat(w(a), "&sign=").concat(c),
    method: 'post'
  })

  data = res.data.data
  if (res.data.code === 'A0000' && data.length) {
    console.log('访问热点首页：', "签到成功！")
  } else {
    console.log('访问热点首页：', res.data.message || "无")
  }

  // a = {
  //   'agenttype': '1',
  //   'agentversion': '0',
  //   'appKey': 'basic_pcw',
  //   'appver': '0',
  //   'authCookie': P00001,
  //   'channelCode': 'paopao_pcw',
  //   'dfp': dfp,
  //   'scoreType': '1',
  //   'srcplatform': '1',
  //   'typeCode': 'point',
  //   'userId': P00PRU,
  //   'user_agent': user_agent,
  //   'verticalCode': 'iQIYI'
  // }

  // c = k("UKobMjDMsDoScuWOfp6F", a, {
  //   split: "|",
  //   sort: !0,
  //   splitSecretKey: !0
  // })

  // res = await axios.request({
  //   headers: {
  //     "referer": "https://www.iqiyi.com",
  //     "origin": "https://www.iqiyi.com"
  //   },
  //   url: "".concat("https://community.iqiyi.com/openApi/score/getReward", "?").concat(w(a), "&sign=").concat(c),
  //   method: 'post'
  // })
  // data = res.data.data
  // if (res.data.code === 'A00000' && data.length) {
  //   console.log('访问热点首页：', "签到成功！成长值+" + data.score + "1点")
  // } else {
  //   console.log('访问热点首页：', res.data.message || "无")
  // }

}