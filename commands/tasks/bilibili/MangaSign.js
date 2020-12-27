module.exports = async (axios) => {
  let platform = "ios"
  return new Promise((resolve, reject) => {
    axios.request({
      headers:{
        "referer": "https://www.bilibili.com",
        "origin": "https://www.bilibili.com",
      },
      url: `https://manga.bilibili.com/twirp/activity.v1.Activity/ClockIn?platform=${platform}`,
      method: 'post'
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      console.log("漫画签到：今日已签到过,无法重复签到")
      resolve()
    })// 400 clockin clockin is duplicat
  })
}