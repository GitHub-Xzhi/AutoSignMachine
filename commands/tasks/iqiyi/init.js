module.exports = (axios) => {
  return new Promise((resolve, reject) => {
    axios.request({
      headers: {
        "referer": "https://www.iqiyi.com",
        "origin": "https://www.iqiyi.com"
      },
      url: 'https://pcw-api.iqiyi.com/passport/user/userinfodetail'
    }).then(res => {
      let result = res.data
      if (result.code !== 'A00000' || !('nickname' in result.data.userInfo)) {
        throw new Error(result.message||result.data.verifyInfo.msg)
      } else {
        let userInfo = result.data
        console.log(`获取用户状态成功  nickname:%s`,userInfo.userInfo.nickname.substr(0, 2) + "********")
        resolve(userInfo)
      }
    }).catch(reject)
  })
}