const useragent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.641.134 Safari/537.36 QBCore/3.43.641.400 QQBrowser/9.0.2524.400'
module.exports = async (axios, options) => {
  return new Promise((resolve, reject) => {
    axios.request({
      baseURL: "https://ptlogin2.qq.com/",
      headers: {
        "cookie": "ClientVersionString=3.0.8265.138; ClientVersionLong=844425471787146; showguofuGameId=1; WebVersion=10; ClientType=4; ChannelType=0",
        "user-agent": useragent,
        "referer": "https://client.jiasu.qq.com/client/v3l/",
        "origin": "https://client.jiasu.qq.com",
      },
      url: `/gamespeed_jump?keyindex=18&clientuin=${options.clientuin}&clientkey=${options.clientkey}&sid=3500&version=3.0.8265.138&guid=c3bbe0fffbb710fc74d650f4029eaa68&test=0&target=801`,
      method: 'get'
    }).then(res => {
      resolve(res.config.jar)
    }).catch(reject)
  })
}