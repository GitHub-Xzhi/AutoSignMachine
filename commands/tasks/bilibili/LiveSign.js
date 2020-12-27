module.exports = async (axios) => {
  return new Promise((resolve, reject) => {
    axios.request({
      headers:{
        "referer": "https://www.bilibili.com",
        "origin": "https://www.bilibili.com",
      },
      url: `https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign`,
      method: 'get'
    }).then(res => {
      if (res.data.code === 0) {
        console.log("直播中心签到：", '签到成功')
      } else {
        console.log("直播中心签到：", res.data.message)
      }
      resolve(res.data)
    }).catch(reject)
  })
}