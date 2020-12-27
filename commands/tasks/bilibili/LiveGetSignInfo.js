module.exports = (axios) => {
    return new Promise((resolve, reject) => {
      axios.request({
        headers:{
          "referer": "https://live.bilibili.com",
          "origin": "https://live.bilibili.com",
        },
        url: 'https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/WebGetSignInfo'
      }).then(res => {
        let result = res.data
        if (result.code !== 0) {
          console.log('获取当月直播签到状态失败', result.message)
        } else {
          console.log('获取当月直播签到状态成功 ','累计签到'+result.data.hadSignDays+'/'+result.data.allDays)
          resolve(result.data)
        }
      }).catch(reject)
    })
  }