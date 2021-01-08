var transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data['' + item + '']);
  }
  return params;
};

module.exports = {
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

  todaySign: async (axios, options) => {
    const useragent = `okhttp/4.4.0`
    let { data } = await axios.request({
      baseURL: 'https://act.10010.com/',
      headers: {
        "user-agent": useragent,
        "referer": "https://img.client.10010.com",
        "origin": "https://img.client.10010.com"
      },
      url: `/SigninApp/signin/todaySign`,
      method: 'post'
    })
    if (data.status = '0000') {
      console.log('翻倍签到成功')
    } else {
      console.log('翻倍签到失败')
    }
  },

  gamebox: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let params = {
      'methodType': 'reward',
      'deviceType': 'Android',
      'clientVersion': '8.0100',
      'isVideo': 'N'
    }
    let { data } = await axios.request({
      baseURL: 'https://m.client.10010.com/',
      headers: {
        "user-agent": useragent,
        "referer": "https://img.client.10010.com",
        "origin": "https://img.client.10010.com"
      },
      url: `/game_box`,
      method: 'post',
      data: transParams(params)
    })
    if (data) {
      if (data.code !== '0000') {
        console.log(data.desc)
      } else {
        console.log('宝箱领取成功', data.desc)
      }
    } else {
      console.log('宝箱领取失败')
    }
  },
  // gamebox1: async (axios, options) => {
  //   const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
  //   let params = {
  //     'thirdUrl': 'https://img.client.10010.com/shouyeyouxi/index.html#/youxibaox',
  //   }
  //   let res = await axios.request({
  //     baseURL: 'https://m.client.10010.com/',
  //     headers: {
  //       "user-agent": useragent,
  //       "referer": "https://img.client.10010.com",
  //       "origin": "https://img.client.10010.com"
  //     },
  //     url: `/mobileService/customer/getShareRedisInfo.htm`,
  //     method: 'post',
  //     data: transParams(params)
  //   })
  //   if (res.status === 200) {
  //     console.log('宝箱领取成功')
  //   } else {
  //     console.log('宝箱领取失败')
  //   }
  // }
}