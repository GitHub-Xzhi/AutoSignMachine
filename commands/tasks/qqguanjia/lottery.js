const useragent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.641.134 Safari/537.36 QBCore/3.43.641.400 QQBrowser/9.0.2524.400'
function _getTk(skey) {
  var tk = "";
  var skey = skey;
  if (skey != null) {
    var hash = 5381;
    var i = 0,
      len = skey.length;
    for (; i < len; ++i) {
      hash += (hash << 5) + skey.charAt(i).charCodeAt();
    }
    tk = hash & 0x7fffffff;
  }
  return tk;
}

module.exports = {
  getLotteryChance: async (axios, options) => {
    let uin = undefined
    let skey = undefined
    axios.defaults.headers.Cookie.split('; ').forEach(item => {
      if (item.indexOf('skey') === 0) {
        skey = item.split("=").pop()
      }
      if (item.indexOf('uin') === 0) {
        uin = item.split("=").pop()
      }
    })
    // let cookiesJson = cookiejar.toJSON()
    // let skey = cookiesJson.cookies.find(i => i.key=='skey')
    if (!skey) {
      throw new Error('无法获取skey')
    }
    let gjtk = _getTk(skey)
    return new Promise((resolve, reject) => {
      axios.request({
        headers: {
          "user-agent": useragent,
          "referer": "https://client.jiasu.qq.com/client/v3l/",
          "origin": "https://client.jiasu.qq.com",
        },
        url: "https://act.guanjia.qq.com/bin/user/qryzgjf.php?actId=" + 1069 + "&needRank=0&callback=jQuery17206880205094348639_1608965118752&uin=" + uin + "&skey=" + skey + "&gjtk=" + gjtk,
        method: 'get'
      }).then(res => {
        let str = res.data
        if (str.indexOf('jQuery17206880205094348639_1608965118752') !== -1) {
          str = str.replace('jQuery17206880205094348639_1608965118752(', '')
          str = str.slice(0, str.length - 1)
          let result = JSON.parse(str)
          if (result.code === 0) {
            console.log('剩余抽奖机会', result.result.score)
            resolve(result)
          } else {
            throw new Error('获取抽奖机会数量失败 ' + result.msg)
          }
        } else {
          throw new Error('获取抽奖机会数量失败')
        }
      }).catch(reject)
    })
  },
  getGiftList: async (axios, options) => {
    let uin = undefined
    let skey = undefined
    axios.defaults.headers.Cookie.split('; ').forEach(item => {
      if (item.indexOf('skey') === 0) {
        skey = item.split("=").pop()
      }
      if (item.indexOf('uin') === 0) {
        uin = item.split("=").pop()
      }
    })
    if (!skey) {
      throw new Error('无法获取skey')
    }
    let gjtk = _getTk(skey)
    return new Promise((resolve, reject) => {
      axios.request({
        headers: {
          "user-agent": useragent,
          "referer": "https://client.jiasu.qq.com/client/v3l/",
          "origin": "https://client.jiasu.qq.com",
        },
        url: "https://act.guanjia.qq.com/bin/user/uhd.php?actId=" + 1069 + "&callback=jQuery17206880205094348639_1608965118752&uin=" + uin + "&skey=" + skey + "&gjtk=" + gjtk,
        method: 'get'
      }).then(res => {
        let str = res.data
        if (str.indexOf('jQuery17206880205094348639_1608965118752') !== -1) {
          str = str.replace('jQuery17206880205094348639_1608965118752(', '')
          str = str.slice(0, str.length - 1)
          let result = JSON.parse(str)
          if (result.code === 0) {
            if (result.results.length) {
              result.results.map(t => console.log(i.name))
            } else {
              console.log('暂无中奖礼品')
            }
            resolve(result)
          } else {
            throw new Error('获取奖品列表失败')
          }
        } else {
          throw new Error('获取奖品列表失败')
        }
      }).catch(reject)
    })
  }
}