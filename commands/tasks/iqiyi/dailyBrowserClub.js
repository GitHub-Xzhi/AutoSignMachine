
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
  console.log('浏览会员俱乐部任务')
  
  let P00001 = undefined
  let QC005 = undefined
  let dfp = undefined
  axios.defaults.headers.Cookie.split('; ').forEach(item => {
    if (item.indexOf('P00001') === 0) {
      P00001 = item.split("=").pop()
    }
    if (item.indexOf('QC005') === 0) {
      QC005 = item.split("=").pop()
    }
    if (item.indexOf('_dfp') === 0) {
      dfp = item.split("=").pop().split("@")[0]
    }
  })

  var p = {
    'P00001': P00001,
    'taskCode': 'b6e688905d4e7184',
    'platform': 'b6c13e26323c537d',
    'lang': 'zh_CN',
    'app_lm': 'cn'
  }
  let res = await axios.request({
    headers: {
      "referer": "https://www.iqiyi.com",
      "origin": "https://www.iqiyi.com"
    },
    url: "".concat("https://tc.vip.iqiyi.com/taskCenter/task/joinTask", "?").concat(w(p)),
  })
  if(res.data.code==='A00000'){
    console.log('领取浏览会员俱乐部任务成功')

    await axios.request({
      headers: {
        "referer": "https://www.iqiyi.com",
        "origin": "https://www.iqiyi.com"
      },
      url: "https://www.iqiyi.com/kszt/pcwnewclub.html"
    })

    var a = {
      P00001: P00001,
      taskCode: 'b6e688905d4e7184',
      dfp: dfp,
      platform: 'b6c13e26323c537d',
      lang: 'zh_CN',
      app_lm: 'cn',
      deviceID: QC005,
      token: '',
      multiReward: 1,
      fv: 'bed99b2cf5722bfe'
    }

    let res = await axios.request({
      headers: {
        "referer": "https://www.iqiyi.com",
        "origin": "https://www.iqiyi.com"
      },
      url: "".concat("https://tc.vip.iqiyi.com/taskCenter/task/getTaskRewards", "?").concat(w(a)),
      method: 'post'
    })
    data = res.data.data
    if (res.data.code === 'A00000' && data.length) {
      console.log('浏览会员俱乐部任务：', "签到成功！成长值+1点")
    } else {
      console.log('浏览会员俱乐部任务：', res.data.message||"无")
    }

  } else {
    console.log('领取浏览会员俱乐部任务失败：', res.data.msg)
  }
}