module.exports = {
  getSigninIntegral: (axios, options) => {
    const useragent = `okhttp/4.4.0`
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://act.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com",
          "origin": "https://img.client.10010.com"
        },
        url: `/SigninApp/signin/getIntegral`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if (result.status !== '0000') {
          throw new Error(result.msg)
        } else {
          if (result.status === '0000') {
            console.log('用户已有累计积分:' + result.data.integralTotal)
            resolve(result.data)
          } else {
            throw new Error('获取积分信息失败')
          }
        }
      }).catch(reject)
    })
  },
  getflDetail: (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com/jifenshangcheng/jifen?loginType=0&scopeType=fl",
          "origin": "https://img.client.10010.com"
        },
        url: `/welfare-mall-front/mobile/show/flDetail/v1/0`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if (result.code !== '0') {
          console.log('查询奖励积分失败', result.msg)
        } else {
          console.log('总奖励积分%s,可用奖励积分%s', result.resdata.score.totalscore, result.resdata.score.availablescore)
        }
        resolve()
      }).catch(reject)
    })
  },
  getTxDetail: (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com/jifenshangcheng/jifen?loginType=0&scopeType=fl",
          "origin": "https://img.client.10010.com"
        },
        url: `/welfare-mall-front/mobile/show/txDetail/v1/0`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if (result.code !== '0') {
          console.log('查询通信积分失败', result.msg)
        } else {
          console.log('总通信积分%s,可用通信积分%s', result.resdata.score.totalscore, result.resdata.score.availablescore)
        }
        resolve()
      }).catch(reject)
    })
  },
  getDxDetail: (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com/jifenshangcheng/jifen?loginType=0&scopeType=fl",
          "origin": "https://img.client.10010.com"
        },
        url: `/welfare-mall-front/mobile/newShow/pointsdetails`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if (result.code !== '200') {
          console.log('查询定向积分失败', result.msg)
        } else {
          console.log('总定向积分%s,可用定向积分%s,月到期%s', result.resdata.total, result.resdata.Surplus, result.resdata.expnum)
        }
        resolve()
      }).catch(reject)
    })
  },
  getCoins: (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://act.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://act.10010.com/SigninApp/signinCoinDetails/jumpCoinDetails.do",
          "origin": "https://act.10010.com"
        },
        url: `/SigninApp/signin/getGoldTotal`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if (result.status !== '0000') {
          console.log('查询金币信息失败', result.msg)
        } else {
          console.log('总金币%s', result.data.goldTotal)
        }
        resolve()
      }).catch(reject)
    })
  },
  winterTwoGetIntegral: (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com/",
          "origin": "https://img.client.10010.com"
        },
        url: `/welfare-mall-front/mobile/winterTwo/getIntegral/v1`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if (result.resdata.code !== '0000') {
          console.log('东奥积分活动领取失败', result.resdata.desc)
        } else {
          console.log('东奥积分活动领取成功')
        }
        resolve()
      }).catch(reject)
    })
  },
  winterTwoStatus: (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com/",
          "origin": "https://img.client.10010.com"
        },
        url: `/welfare-mall-front/mobile/winterTwo/winterTwoShop/v1`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if (result.resdata.code !== '0000') {
          console.log('获取东奥积分活动状态失败', result.resdata.desc)
        } else {
          console.log('获取东奥积分活动状态成功 已连续领取%s天', result.resdata.signDays)
        }
        resolve()
      }).catch(reject)
    })
  },

  dxIntegralEveryDay: (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com/",
          "origin": "https://img.client.10010.com"
        },
        url: `/welfare-mall-front/mobile/integral/gettheintegral/v1`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if (result.code !== '0') {
          console.log('每日定向积分领取失败', result.msg)
        } else {
          console.log('每日定向积分领取成功')
        }
        resolve()
      }).catch(reject)
    })
  },
  // 每日积分抽奖
  dailylotteryencryptmobile: (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": `https://img.client.10010.com/jifenshangcheng/Directional?from=9110001000%E2%80%8B&yw_code=&desmobile=${options.user}&version=android%408.0100`,
          "origin": "https://img.client.10010.com"
        },
        url: `/dailylottery/static/textdl/userLogin?flag=1&floortype=tbanner&from=9110001000%E2%80%8B&oneid=undefined&twoid=undefined`,
        method: 'get'
      }).then(res => {
        let result = res.data
        let encryptmobile = result.substr(result.indexOf('encryptmobile=') + 14, 32)
        resolve(encryptmobile)
      }).catch(reject)
    })
  },
  dailylottery: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let encryptmobile = await module.exports.dailylotteryencryptmobile(axios, options)
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com/",
          "origin": "https://img.client.10010.com"
        },
        url: `/dailylottery/static/integral/choujiang?usernumberofjsp=${encryptmobile}`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if ('id' in result) {
          console.log('获得奖品', result.RspMsg)
        } else {
          console.log('抽奖失败', result.RspMsg)
        }
        resolve()
      }).catch(reject)
    })
  },

  // 每日积分签到状态
  signTask: (axios, options) => {
    const useragent = `okhttp/4.4.0`
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://act.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com",
          "origin": "https://img.client.10010.com"
        },
        url: `/SigninApp/signin/getContinuous`,
        method: 'post'
      }).then(res => {
        resolve(res.data)
      }).catch(reject)
    })
  },

  // 每日积分签到
  daySign: (axios, options) => {
    const useragent = `okhttp/4.4.0`
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://act.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com",
          "origin": "https://img.client.10010.com"
        },
        url: `/SigninApp/signin/daySign`,
        method: 'post'
      }).then(res => {
        resolve(res.data)
      }).catch(reject)
    })
  }
}