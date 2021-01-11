var crypto = require('crypto');
const { RSAUtils } = require('./RSAUtils');

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

function w() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
    , t = [];
  return Object.keys(e).forEach((function (a) {
    t.push("".concat(a, "=").concat(encodeURIComponent(e[a])))
  }
  )),
    t.join("&")
}

var dailyVideoBook = {
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
    let { num, jar } = await dailyVideoBook.query(request, options)
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
  oauthMethod: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `https://img.client.10010.com/`,
        "origin": "https://img.client.10010.com"
      },
      url: `https://m.client.10010.com/finderInterface/woReadOauth/?typeCode=oauthMethod`,
      method: 'GET'
    })
    return data.data.key
  },
  login: async (axios, options) => {
    const { Authorization } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `

    let { data, config } = await axios.request({
      headers: {
        "user-agent": useragent,
        "AuthorizationClient": `Bearer ${Authorization}`,
        "Content-Type": "application/json",
        "referer": `https://img.client.10010.com/`,
        "origin": "https://img.client.10010.com"
      },
      url: `https://m.iread.wo.cn/touchextenernal/proxy/login`,
      method: 'GET',
      data: { "phone": options.user }
    })

    let cookiesJson = config.jar.toJSON()
    let diwert = cookiesJson.cookies.find(i => i.key == 'diwert')
    let useraccount = cookiesJson.cookies.find(i => i.key == 'useraccount')
    let m_jar = config.jar
    let st_jar
    let res
    if (!useraccount || !diwert) {
      //密码加密
      var modulus = "00D9C7EE8B8C599CD75FC2629DBFC18625B677E6BA66E81102CF2D644A5C3550775163095A3AA7ED9091F0152A0B764EF8C301B63097495C7E4EA7CF2795029F61229828221B510AAE9A594CA002BA4F44CA7D1196697AEB833FD95F2FA6A5B9C2C0C44220E1761B4AB1A1520612754E94C55DC097D02C2157A8E8F159232ABC87";
      var exponent = "010001";
      var key = RSAUtils.getKeyPair(exponent, '', modulus);
      let phonenum = RSAUtils.encryptedString(key, options.user);

      res = await axios.request({
        headers: {
          "user-agent": useragent
        },
        url: `http://m.iread.wo.cn/touchextenernal/common/shouTingLogin.action`,
        method: 'POST',
        data: transParams({
          phonenum
        })
      })
      m_jar = res.config.jar

      res = await axios.request({
        headers: {
          "user-agent": useragent
        },
        url: `http://st.woread.com.cn/touchextenernal/common/shouTingLogin.action`,
        method: 'POST',
        data: transParams({
          phonenum
        })
      })
      st_jar = res.config.jar
    }


    res = await axios.request({
      headers: {
        "user-agent": useragent,
      },
      url: `http://st.woread.com.cn/touchextenernal/read/index.action?channelid=18000018&yw_code=&desmobile=${options.user}&version=android@8.0100`,
      method: 'GET',
      jar: st_jar
    })

    return {
      Token: data.message,
      st_jar: res.config.jar || st_jar,
      m_jar
    }
  },
  updatePersonReadtime: async (axios, options) => {
    const { detail, jar } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let res = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://m.iread.wo.cn/`,
        "origin": "http://m.iread.wo.cn"
      },
      url: `http://m.iread.wo.cn/touchextenernal/contentread/ajaxUpdatePersonReadtime.action`,
      method: 'POST',
      jar,
      data: transParams({
        'cntindex': detail.cntindex,
        'cntname': detail.cntname,
        'time': 0
      })
    })
    console.log('ajaxUpdatePersonReadtime', res.data)
    await dailyVideoBook.addDrawTimes(axios, {
      ...options,
      detail,
      jar
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 1000))
    res = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://m.iread.wo.cn/`,
        "origin": "http://m.iread.wo.cn"
      },
      url: `http://m.iread.wo.cn/touchextenernal/contentread/updateReadTimes.action`,
      method: 'POST',
      jar,
      data: transParams({
        'cntid': detail.cntid,
        'cnttype': detail.cnttype
      })
    })

    console.log('updateReadTimes', res.data.message)

    await new Promise((resolve, reject) => setTimeout(resolve, 2 * 60 * 1000))

    res = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://m.iread.wo.cn/`,
        "origin": "http://m.iread.wo.cn"
      },
      url: `http://m.iread.wo.cn/touchextenernal/contentread/ajaxUpdatePersonReadtime.action`,
      method: 'POST',
      jar,
      data: transParams({
        'cntindex': detail.cntindex,
        'cntname': detail.cntname,
        'time': 2
      })
    })
    console.log('ajaxUpdatePersonReadtime', res.data)
    await new Promise((resolve, reject) => setTimeout(resolve, 1000))

    await dailyVideoBook.addReadRatioToRedis(axios, {
      ...options,
      detail,
      jar
    })

    console.log('完成阅读时间上报')
  },
  addDrawTimes: async (axios, options) => {
    let { jar } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `https://m.iread.wo.cn/`,
        "origin": "http://m.iread.wo.cn"
      },
      url: `http://st.woread.com.cn/touchextenernal/readluchdraw/addDrawTimes.action`,
      method: 'POST',
      jar
    })

    console.log('addDrawTimes', data.message)
  },
  addReadRatioToRedis: async (axios, options) => {
    let { jar, detail } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `https://m.iread.wo.cn/`,
        "origin": "http://m.iread.wo.cn"
      },
      url: `http://m.iread.wo.cn/touchextenernal/contentread/addReadRatioToRedis.action`,
      method: 'POST',
      jar,
      data: transParams({
        'chapterallindex': detail.chapterallindex,
        'cntindex': detail.cntindex,
        'curChaptNo': detail.chapterseno,
        'curChaptRatio': '0.0539946886857252',
        'curChaptWidth': '313.052',
        'volumeallindex': detail.chapterallindex
      })
    })
    console.log('addReadRatioToRedis', data.message)
  },
  giftBoints: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let Authorization = await dailyVideoBook.oauthMethod(axios, options)
    let { Token, m_jar, st_jar } = await dailyVideoBook.login(axios, {
      ...options,
      Authorization
    })
    //POST http://st.woread.com.cn/touchextenernal/read/getUpDownChapter.action HTTP/1.1
    //chapterseno	1
    // cntindex	480230

    let detail = {
      'cntindex': '480230',
      'catid': '118440',
      'pageIndex': '10843',
      'cardid': '11910',
      'desmobile': '17585920865',
      'version': 'android@8.0100',
      'cntname': '乡村小农医',
      'channelid': '18000018',
      'chapterallindex': '38096061',
      'volumeallindex': '1297284',
      'chapterseno': '1',
      'cntid': '10480230'
    }

    await dailyVideoBook.updatePersonReadtime(axios, {
      ...options,
      detail,
      jar: m_jar
    })

    let { data, config } = await axios.request({
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
      if (data.data.state === '0') {
        console.log('提交积分翻倍')
        await dailyVideoBook.lookVideoDouble(axios, {
          ...options,
          jar: config.jar
        })
      }
    } else {
      console.log('领取阅读积分出错', data.msg)
    }
  },
  lookVideoDouble: async (axios, options) => {
    const { jar } = options
    let params = {
      'arguments1': '', // acid
      'arguments2': 'GGPD', // yhChannel
      'arguments3': '', // yhTaskId menuId
      'arguments4': new Date().getTime(), // time
      'arguments6': '',
      'arguments7': '',
      'arguments8': '',
      'arguments9': '',
      'orderId': crypto.createHash('md5').update(new Date().getTime() + '').digest('hex'),
      'netWay': 'Wifi',
      'remark': '签到积分翻倍',
      'remark1': '签到任务读小说赚积分',
      'version': `android@8.0100`,
      'codeId': 945535625
    }
    await require('./taskcallback').reward(axios, {
      ...options,
      params,
      jar
    })

    await dailyVideoBook.lookVideoDoubleResult(axios, options)
  },
  lookVideoDoubleResult: async (axios, options) => {
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
        'type': 'readNovelDouble'
      })
    })
    console.log('翻倍结果', data.msg)
  }
}

module.exports = dailyVideoBook