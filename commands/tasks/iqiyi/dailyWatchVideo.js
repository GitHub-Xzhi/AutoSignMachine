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

module.exports = {
  getRndVideo: async (axios) => {
    return new Promise((resolve, reject) => {
      axios.request({
        headers: {
          "referer": "https://list.iqiyi.com/",
          "origin": "https://list.iqiyi.com",
        },
        url: `https://pcw-api.iqiyi.com/search/recommend/list?channel_id=2&data_type=1&mode=4&page_id=1&ret_num=48`,
        method: 'get'
      }).then(res => {
        let result = res.data
        if (result.code !== 'A00000') {
          throw new Error('获取视频列表失败')
        }
        resolve(result.data.list)
      }).catch(reject)
    })
  },
  reportPlayTime: async (axios) => {
    let videos = await module.exports.getRndVideo(axios)
    let isComplete = false
    for (let video of videos) {
      let res = await axios.get(video.playUrl)
      let str = res.data.substr(res.data.indexOf("param['tvid']") + 15, 30)
      let tvid = str.match(/\"(\d.*)\"/)[1]
      res = await axios.request({
        headers: {
          "referer": video.playUrl,
          "origin": "https://www.iqiyi.com",
        },
        url: `https://l-rcd.iqiyi.com/apis/qiyirc/getvplay?tvId=${tvid}&agent_type=1`,
        method: 'get'
      })
      if (res.data.indexOf('A00000') === -1) {
        continue
      }
      let history = JSON.parse(res.data)
      let videoPlayTime = (history.data && history.data.videoPlayTime) ? history.data.videoPlayTime : 1
      console.log('videoPlayTime', videoPlayTime)
      do {
        let report = `https://l-rcd.iqiyi.com/apis/qiyirc/setrc.php?tvId=${tvid}&terminalId=11&agent_type=1&videoPlayTime=${videoPlayTime}`
        videoPlayTime = videoPlayTime + 300 + parseInt(Math.random() * 30)
        res = await axios.request({
          headers: {
            "referer": video.playUrl,
            "origin": "https://www.iqiyi.com",
          },
          url: report,
          method: 'get'
        })
        if (res.data.indexOf('A00000') === -1) {
          continue
        }
        console.log('上报播放时长', video.name, videoPlayTime)
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 20 * 1000)
        })
      } while (videoPlayTime <= 35 * 60)

      let cookiesJson = res.config.jar.toJSON()
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
        'srcplatform': '1',
        'typeCode': 'point',
        'userId': P00PRU,
        'verticalCode': 'iQIYI'
      }
      console.log('查询观看视频任务状态')
      var c = k("UKobMjDMsDoScuWOfp6F", a, {
        split: "|",
        sort: !0,
        splitSecretKey: !0
      })

      res = await axios.request({
        headers: {
          "referer": "https://www.iqiyi.com",
          "origin": "https://www.iqiyi.com"
        },
        url: "".concat("https://community.iqiyi.com/openApi/task/list", "?").concat(w(a), "&sign=").concat(c),
        method: 'post'
      })

      if (res.data.code !== 'A00000') {
        console.log(res.data.message)
        continue
      } else {
        let it = res.data.data[0].find(i => i.channelCode === 'view_pcw')
        console.log('任务进度：已完成', it.processCount, '次')
        if (it.processCount >= 3) {
          isComplete = true
          break
        }
      }
    }
    if (!isComplete) {
      throw new Error('本次执行尚未完成视频观看任务，等待下次尝试')
    }
  },
}