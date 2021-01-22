module.exports = (axios) => {
  return new Promise((resolve, reject) => {
    axios.request({
      headers: {
        "referer": "https://account.bilibili.com/account/home",
        "origin": "https://www.bilibili.com",
      },
      url: 'https://api.bilibili.com/x/member/web/exp/reward',
      method:'get'
    }).then(res => {
      let result = res.data
      if (result.code !== 0) {
        console.log('获取每日任务状态失败', result.message)
        throw new Error('获取每日任务状态失败:' + result.message)
      } else {
        console.log('获取每日任务状态成功 ', '每日登录+5' + (result.data.login ? '完成' : '未完成'), '每日观看视频+5' + (result.data.watch ? '完成' : '未完成'), '每日投币+50' + (result.data.coins ? '完成' : '未完成'), '每日分享视频+5' + (result.data.share ? '完成' : '未完成'))
        resolve(result.data)
      }
    }).catch(reject)
  })
}