var crypto = require('crypto');
var moment = require('moment');

// 签到小游戏买什么都省免费夺宝
var transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data['' + item + '']);
  }
  return params;
};

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

function encryption (data, key) {
  var iv = "";
  var cipherEncoding = 'base64';
  var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString(cipherEncoding);
}

var dailyVideoFreeGoods = {
  getGoodsList: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let result = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `https://wxapp.msmds.cn/`,
        "origin": "https://wxapp.msmds.cn"
      },
      url: `https://wxapp.msmds.cn/jplus/api/channel/integral/free/goods/home/list`,
      method: 'POST'
    })
    return result.data.data
  },
  doTask: async (axios, options) => {
    let phone = encryption(options.user, 'gb6YCccUvth75Tm2')
    let goods = await dailyVideoFreeGoods.getGoodsList(axios, options)
    let params = {
      'arguments1': '',
      'arguments2': '',
      'arguments3': '',
      'arguments4': new Date().getTime(),
      'arguments6': '',
      'arguments7': '',
      'arguments8': '',
      'arguments9': '',
      'netWay': 'Wifi',
      'remark': '签到小游戏买什么都省免费夺宝',
      'version': `android@8.0100`,
      'codeId': 945535689
    }
    params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])

    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`

    // 随机商品 似乎限制只能有3次参与机会  这里采用随机商品，每个商品一次的方式
    let num = 3
    do {
      let good = goods[Math.floor(Math.random() * goods.length)]

      console.log('开始处理', good.goodsName)
      params['orderId'] = crypto.createHash('md5').update(new Date().getTime() + '').digest('hex')
      params['arguments4'] = new Date().getTime()

      let searchParams = {}
      let result = await axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": `https://img.client.10010.com/`,
          "origin": "https://img.client.10010.com"
        },
        url: `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/freeTakeGoodDetail/${good.id}?source=unicom`,
        method: 'get',
        transformResponse: (data, headers) => {
          if ('location' in headers) {
            let uu = new URL(headers.location)
            let pp = {}
            for (let p of uu.searchParams) {
              pp[p[0]] = p[1]
            }
            if ('ticket' in pp) {
              searchParams = pp
            }
          }
          return data
        }
      }).catch(err => console.log(err))

      let jar1 = result.config.jar

      let cookiesJson = jar1.toJSON()
      let ecs_token = cookiesJson.cookies.find(i => i.key == 'ecs_token')
      ecs_token = ecs_token.value
      if (!ecs_token) {
        throw new Error('ecs_token缺失')
      }

      let p = {
        'channelId': 'LT_channel',
        'phone': phone,
        'token': ecs_token,
        'sourceCode': 'lt_freeTake'
      }

      let timestamp = moment(new Date(res.times)).format('YYYYMMDDHHmmss')
      result = await axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": `https://wxapp.msmds.cn/h5/react_web/unicom/freeTakeGoodDetail/${good.id}?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&userNumber=${options.user}        `,
          "origin": "https://wxapp.msmds.cn"
        },
        url: `https://wxapp.msmds.cn/jplus/api/channel/integral/free/goods/getTimes`,
        method: 'GET',
        params: transParams(p)
      })

      if (result.data.data.time) {
        throw new Error(`已处于限制期，需${result.data.data.time}秒后重试`)
      }

      result = await require('./taskcallback').reward(axios, {
        ...options,
        params,
        jar: jar1
      })

      result = await axios.request({
        headers: {
          "user-agent": useragent,
          "referer": `https://wxapp.msmds.cn/`,
          "origin": "https://wxapp.msmds.cn"
        },
        url: `https://wxapp.msmds.cn/jplus/api/channel/integral/free/goods/goodsInfo`,
        method: 'POST',
        data: transParams({
          'channelId': 'LT_channel',
          'id': good.id,
          'phone': phone,
          'sourceCode': 'lt_freeTake',
          'token': ecs_token
        })
      })

      let timestamp = moment(new Date(res.times)).format('YYYYMMDDHHmmss')
      result = await axios.request({
        headers: {
          "user-agent": useragent,
          "referer": `https://wxapp.msmds.cn/h5/react_web/unicom/freeTakeGoodDetail/${good.id}?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&userNumber=${options.user}`,
          "origin": "https://wxapp.msmds.cn"
        },
        url: `https://wxapp.msmds.cn/jplus/api/channel/integral/free/goods/doFreeGoods`,
        method: 'POST',
        data: transParams({
          'channelId': 'LT_channel',
          'code': '',
          'flag': '',
          'id': good.id,
          "phone": phone,
          'sourceCode': 'lt_freeTake',
          'taskId': '',
          'token': ecs_token,
          'videoOrderNo': params.orderId
        })
      })
      if (result.data.code !== 2000) {
        console.log(result.data.msg)
      } else {
        if (result.data.data.luckCode) {
          console.log('提交任务成功', `券码：${result.data.data.luckCode}`)
        } else if (result.data.data.time) {
          console.log('提交任务成功', `需${result.data.data.time}秒后重试`)
        } else {
          console.log('提交任务成功')
        }
      }
      console.log('等待15秒再继续')
      await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000))

    } while (--num)
  }
}

module.exports = dailyVideoFreeGoods