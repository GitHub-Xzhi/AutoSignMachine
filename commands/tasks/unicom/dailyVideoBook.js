var crypto = require('crypto');

//阅读打卡看视频得积分

var sign = (data) => {
  let str = 'integralofficial&'
  let params = []
  data.forEach((v, i) => {
    if (v) {
      params.push('arguments' + (i + 1) + v)
    }
  });
  return crypto.createHash('md5').update(str + params.join('&')).digest('hex')
}

var transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data['' + item + '']);
  }
  return params;
};

let account = {
  yhTaskId: "2f2a13e527594a31aebfde5af673524f",
  yhChannel: "GGPD",
  accountChannel: "517050707",
  accountUserName: "517050707",
  accountPassword: "123456",
  accountToken: "4640b530b3f7481bb5821c6871854ce5",
}
var dailyVideo = {
  query: async (request, options) => {
    let params = {
      'arguments1': 'AC20200521222721', // acid
      'arguments2': account.yhChannel, // yhChannel
      'arguments3': account.yhTaskId, // yhTaskId menuId
      'arguments4': new Date().getTime(), // time
      'arguments6': account.accountChannel,
      'netWay': 'Wifi',
      'version': `android@8.0100`
    }
    params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
    return await require('./taskcallback').query(request, {
      ...options,
      params
    })
  },
  doTask: async (request, options) => {
    let { num, jar } = await dailyVideo.query(request, options)
    if (!num) {
      console.log('阅读打卡看视频得积分: 今日已完成')
      return
    }
    do {
      console.log('第', num, '次')
      let params = {
        'arguments1': 'AC20200521222721', // acid
        'arguments2': account.yhChannel, // yhChannel
        'arguments3': account.yhTaskId, // yhTaskId menuId
        'arguments4': new Date().getTime(), // time
        'arguments6': '',
        'arguments7': '',
        'arguments8': '',
        'arguments9': '',
        'orderId': crypto.createHash('md5').update(new Date().getTime() + '').digest('hex'),
        'netWay': 'Wifi',
        'remark': '阅读打卡看视频得积分',
        'version': `android@8.0100`,
        'codeId': 945535616
      }
      params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
      await require('./taskcallback').doTask(request, {
        ...options,
        params,
        jar
      })
    } while (--num)
  },
  giftBoints: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `https://img.client.10010.com/`,
        "origin": "https://img.client.10010.com"
      },
      url: `https://act.10010.com/SigninApp/integral/giftBoints`,
      method: 'POST',
      data: transParams({
        'type': 'readNovel'
      })
    })
    if (data.status === '0000') {
      console.log('领取阅读积分状态', data.data.state === '0' ? data.data.equityValue : data.data.statusDesc)
    } else {
      console.log('领取阅读积分出错', data.msg)
    }
  }
}

module.exports = dailyVideo