var fetchVideo = (axios) => {
  return new Promise((resolve, reject) => {
    let rids = [1, 3, 4, 5, 160, 22, 119]
    let days = [1, 3, 7]
    let rid = rids[Math.floor(Math.random() * rids.length)]
    let day = days[Math.floor(Math.random() * days.length)]
    axios.request({
      headers: {
        "referer": "https://www.bilibili.com",
        "origin": "https://www.bilibili.com",
      },
      url: `https://api.bilibili.com/x/web-interface/ranking/region?rid=${rid}&day=${day}`
    }).then(res => {
      let result = res.data
      if (result.code === 0) {
        resolve(result.data[Math.floor(Math.random() * result.data.length)])
      } else {
        throw new Error('获取随机视频失败' + result.message)
      }
    }).catch(reject)
  })
}

var WatchVideo = (axios, videoInfo) => {
  return new Promise((resolve, reject) => {
    let playedTime = Math.floor(Math.random() * 90)
    axios.request({
      headers: {
        "referer": "https://www.bilibili.com",
        "origin": "https://www.bilibili.com",
      },
      url: `https://api.bilibili.com/x/click-interface/web/heartbeat?aid=${videoInfo.aid}&played_time=${playedTime}`,
      method: 'post'
    }).then(res => {
      if (res.data.code == 0) {
        console.log("视频播放成功,已观看到第%s秒", playedTime);
      } else {
        console.log("视频播放失败,原因：%s", res.data.message);
      }
      resolve(res.data)
    }).catch(reject)
  })
}

var ShareVideo = (axios, videoInfo, bili_jct) => {
  return new Promise((resolve, reject) => {
    axios.request({
      headers: {
        "referer": "https://www.bilibili.com",
        "origin": "https://www.bilibili.com",
      },
      url: `https://api.bilibili.com/x/web-interface/share/add?aid=${videoInfo.aid}&csrf=${bili_jct}`,
      method: 'post'
    }).then(res => {
      if (res.data.code == 0) {
        console.log("视频分享成功");
      } else {
        console.log("视频分享失败,原因：%s", res.data.message);
      }
      resolve(res.data)
    }).catch(reject)
  })
}

module.exports = async (axios, dailyTaskStatus) => {
  let videoInfo = undefined
  let bili_jct = undefined
  axios.defaults.headers.Cookie.split('; ').forEach(item => {
    if (item.indexOf('bili_jct') === 0) {
      bili_jct = item.split("=").pop()
    }
  })
  return new Promise(async (resolve, reject) => {
    if (!dailyTaskStatus.watch || !dailyTaskStatus.share) {
      videoInfo = await fetchVideo(axios)
    }
    if (videoInfo) {
      if (!dailyTaskStatus.watch)
        await WatchVideo(axios, videoInfo);
      else
        console.log("今天已经观看过了，不需要再看啦");

      if (!dailyTaskStatus.share)
        await ShareVideo(axios, videoInfo, bili_jct);
      else
        console.log("今天已经分享过了，不要再分享啦");
    }
    resolve()
  })
}