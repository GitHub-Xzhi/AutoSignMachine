module.exports = (axios) => {
    return new Promise((resolve, reject) => {
      axios.request({
        headers:{
          "referer": "https://live.bilibili.com",
          "origin": "https://live.bilibili.com",
        },
        url: 'https://api.live.bilibili.com/pay/v2/Pay/myWallet?need_bp=1&need_metal=1&platform=pc'
      }).then(res => {
        let result = res.data
        if (result.code !== 0) {
          console.log('获取钱包信息失败', result.message)
        } else {
          console.log('获取钱包信息成功 B币%s,硬币%s,银瓜子%s,金瓜子%s',result.data.bp,result.data.metal,result.data.silver,result.data.gold)
          resolve(result.data)
        }
      }).catch(reject)
    })
  }