var crypto = require('crypto');
var moment = require('moment');

// 幸运大转盘
var transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data['' + item + '']);
  }
  return params;
};
function w() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
    , t = [];
  return Object.keys(e).forEach((function (a) {
    t.push("".concat(a, "=").concat(encodeURIComponent(e[a])))
  }
  )),
    t.join("&")
}
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

function encryption(data, key) {
  var iv = "";
  var cipherEncoding = 'base64';
  var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString(cipherEncoding);
}

var dailyTurntablePage = {
  getGoodsList: async (axios, options) => {
    let phone = encryption(options.user, 'gb6YCccUvth75Tm2')
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let result = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `https://wxapp.msmds.cn/`,
        "origin": "https://wxapp.msmds.cn"
      },
      url: `https://wxapp.msmds.cn/jplus/api/change/luck/draw/gift/v1/list`,
      method: 'POST',
      data: transParams({
        'channelId': 'LT_channel',
        'phone': phone,
        'token': options.ecs_token,
        'sourceCode': 'lt_turntable'
      })
    })
    return result.data.data
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
      url: `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/turntablePage`,
      method: 'GET',
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

    let phone = encryption(options.user, 'gb6YCccUvth75Tm2')
    let playCounts = 0
    let isLookVideo = false
    do {
      let res = await dailyTurntablePage.getGoodsList(axios, {
        ...options,
        ecs_token,
        phone
      })


      playCounts = res.playCounts
      isLookVideo = res.isLookVideo

      if (!playCounts && !isLookVideo) {
        console.log('没有游戏次数')
        break
      }

      if (!playCounts && isLookVideo) {

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
          'remark': '签到小游戏买什么都省转盘抽奖',
          'version': `android@8.0100`,
          'codeId': 945535695
        }
        params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
        params['orderId'] = crypto.createHash('md5').update(new Date().getTime() + '').digest('hex')
        params['arguments4'] = new Date().getTime()

        result = await require('./taskcallback').reward(axios, {
          ...options,
          params,
          jar: jar1
        })
        let a = {
          'channelId': 'LT_channel',
          "phone": phone,
          'token': ecs_token,
          'videoOrderNo': params['orderId'],
          'sourceCode': 'lt_turntable'
        }

        let timestamp = moment().format('YYYYMMDDHHmmss')
        result = await axios.request({
          headers: {
            "user-agent": useragent,
            "referer": `https://wxapp.msmds.cn/h5/react_web/unicom/turntablePage?ticket=${searchParams.ticket}&type=02&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&userNumber=${options.user}`,
            "origin": "https://wxapp.msmds.cn"
          },
          url: `https://wxapp.msmds.cn/jplus/api/change/luck/draw/gift/v1/liantong/look/video`,
          method: 'POST',
          data: transParams(a)
        })

        if (result.data.code !== 200) {
          console.log('提交任务失败', result.data.msg)
        } else {
          console.log('提交任务成功', `${result.data.data}`)
        }
      }

      let a = {
        'channelId': 'LT_channel',
        'code': '',
        'flag': '',
        "phone": phone,
        'token': ecs_token,
        'taskId': '',
        'sourceCode': 'lt_turntable'
      }

      let timestamp = moment().format('YYYYMMDDHHmmss')
      result = await axios.request({
        headers: {
          "user-agent": useragent,
          "referer": `https://wxapp.msmds.cn/h5/react_web/unicom/turntablePage?ticket=${searchParams.ticket}&type=02&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&userNumber=${options.user}`,
          "origin": "https://wxapp.msmds.cn"
        },
        url: `https://wxapp.msmds.cn/jplus/api/change/luck/draw/gift/v1/playLuckDraw?` + w(a),
        method: 'POST'
      })

      if (result.data.code !== 200) {
        console.log('提交任务失败', result.data.msg)
      } else {
        let good = result.data.data.list.find(f => f.giftId === result.data.data.giftId)
        console.log('提交任务成功，获得', good.giftName)
        if (result.data.data.lookVideoDouble) {
          console.log('提交积分翻倍')
          await dailyTurntablePage.lookVideoDouble(axios, {
            ...options,
            jar: result.config.jar
          })
        }
      }

      console.log('等待25秒再继续')
      await new Promise((resolve, reject) => setTimeout(resolve, 25 * 1000))

    } while (playCounts || isLookVideo)
  },
  lookVideoDouble: async (axios, options) => {
    const { jar } = options
    let params = {
      'arguments1': 'AC20200716103629', // acid
      'arguments2': 'GGPD', // yhChannel
      'arguments3': 'fc32b68892de4299b6ccfb2de72e1ab8', // yhTaskId menuId
      'arguments4': new Date().getTime(), // time
      'arguments6': '517050707',
      'netWay': 'Wifi',
      'version': `android@8.0100`
    }
    params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
    let { num } = await require('./taskcallback').query(axios, {
      ...options,
      params
    })

    if (!num) {
      console.log('签到小游戏买什么都省转盘抽奖: 今日已完成')
      return
    }
    do {
      console.log('第', num, '次')
      let params = {
        'arguments1': 'AC20200716103629', // acid
        'arguments2': 'GGPD', // yhChannel
        'arguments3': 'fc32b68892de4299b6ccfb2de72e1ab8', // yhTaskId menuId
        'arguments4': new Date().getTime(), // time
        'arguments6': '',
        'arguments7': '',
        'arguments8': '',
        'arguments9': '',
        'orderId': crypto.createHash('md5').update(new Date().getTime() + '').digest('hex'),
        'netWay': 'Wifi',
        'remark': '签到小游戏买什么都省转盘抽奖',
        'version': `android@8.0100`,
        'codeId': 945535695
      }
      params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
      await require('./taskcallback').doTask(axios, {
        ...options,
        params,
        jar
      })
      
      if (num) {
        console.log('等待15秒再继续')
        await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000))
      }

    } while (--num)
  }
}

module.exports = dailyTurntablePage