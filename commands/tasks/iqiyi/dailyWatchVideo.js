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
    let i = 0
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
      let videoPlayTime = (history.data&&history.data.videoPlayTime)? history.data.videoPlayTime : 1
      console.log('videoPlayTime',videoPlayTime)
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
        //https://pcw-api.iqiyi.com/meme/switchStatus?cid=10&albumid=4762157826043700&tvid=4762157826043700
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 5 * 1000)
        })
      } while (videoPlayTime <= 35 * 60)
      i = i + 1;
      if (i > 5) {
        break
      }
    }
  },
}