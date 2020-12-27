module.exports = async (axios) => {
  return new Promise((resolve, reject) => {
    axios.request({
      headers:{
        "referer": "https://www.bilibili.com",
        "origin": "https://www.bilibili.com",
      },
      url: `https://api.live.bilibili.com/pay/v1/Exchange/silver2coin`,
      method: 'get'
    }).then(res => {
      console.log("银瓜子兑换硬币：", res.data.message)
      resolve(res.data)
    }).catch(reject)
  })
}