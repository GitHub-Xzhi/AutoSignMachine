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
    const { token } = options
    let phone = encryption(options.user, 'gb6YCccUvth75Tm2')
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let res = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `https://wxapp.msmds.cn/`,
        "origin": "https://wxapp.msmds.cn"
      },
      url: `https://wxapp.msmds.cn/jplus/api/channel/integral/free/goods/findAll`,
      method: 'POST',
      data: transParams({
        'fromType': '22',
        'status': '0',
        'pageNo': '1',
        'pageSize': '10',
        'channelId': 'LT_channel',
        'phone': phone,
        'token': token,
        'sourceCode': 'lt_freeTake'
      })
    })
    let result = res.data
    return {
      goods: result.data.goodsList.data,
      freeTimes: result.data.freeTimes,
      leftTimes: result.data.leftTimes,
      time: result.data.time,
      getFreeTime: result.data.getFreeTime,
      sameGoodsMaxTimes: result.data.sameGoodsMaxTimes,
    }
  },
  doTask: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`
    let searchParams = {}
    let result = await axios.request({
      baseURL: 'https://m.client.10010.com/',
      headers: {
        "user-agent": useragent,
        "referer": `https://img.client.10010.com/`,
        "origin": "https://img.client.10010.com"
      },
      url: `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/freeTakePage`,
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
    if (!ecs_token) {
      throw new Error('ecs_token缺失')
    }
    ecs_token = ecs_token.value
    let { goods, freeTimes, leftTimes, time, getFreeTime, sameGoodsMaxTimes } = await dailyVideoFreeGoods.getGoodsList(axios, {
      ...options,
      token: ecs_token
    })
    console.log('签到小游戏买什么都省免费夺宝', `剩余机会(${leftTimes}/${freeTimes})`)

    if (!leftTimes) {
      if (time) {
        console.log(`签到小游戏买什么都省免费夺宝: 剩余机会不足，等待下一轮,` + moment().add(time, 'seconds').format('YYYY-MM-DD HH:mm:ss') + ' 后可再次尝试')
      }
    }

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

    let phone = encryption(options.user, 'gb6YCccUvth75Tm2')

    // 同一期商品最多3次机会，每4小时可获得5次机会
    for (let good of goods) {

      console.log('开始处理', good.goodsName)
      params['orderId'] = crypto.createHash('md5').update(new Date().getTime() + '').digest('hex')
      params['arguments4'] = new Date().getTime()

      let p = {
        'channelId': 'LT_channel',
        'phone': phone,
        'token': ecs_token,
        'sourceCode': 'lt_freeTake'
      }

      let timestamp = moment().format('YYYYMMDDHHmmss')
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
        console.log(`已处于限制期，` + moment().add(result.data.data.time, 'seconds').format('YYYY-MM-DD HH:mm:ss') + ' 后可再次尝试，跳过')
        break
      }

      result = await require('./taskcallback').reward(axios, {
        ...options,
        params,
        jar: jar1
      })

      timestamp = moment().format('YYYYMMDDHHmmss')
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
          throw new Error(`已处于限制期，` + moment().add(result.data.data.time, 'seconds').format('YYYY-MM-DD HH:mm:ss') + ' 后可再次尝试')
        } else {
          console.log('提交任务成功')
        }
      }
      console.log('等待25秒再继续')
      await new Promise((resolve, reject) => setTimeout(resolve, 25 * 1000))
    }
  }
}

module.exports = dailyVideoFreeGoods