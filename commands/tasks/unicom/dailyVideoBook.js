const crypto = require('crypto');
const { RSAUtils } = require('./RSAUtils');
const moment = require('moment');

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
  getBookUpDownChapter: async (axios, options) => {
    const { jar, book, chapter } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data, config } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://st.woread.com.cn/`,
        "origin": "http://st.woread.com.cn"
      },
      url: `http://st.woread.com.cn/touchextenernal/read/getUpDownChapter.action`,
      method: 'POST',
      jar,
      data: transParams({
        'cntindex': book.cntindex,
        'chapterseno': chapter.chapterseno || 1
      })
    })
    return data.message
  },
  getBookList: async (axios, options) => {
    const { jar, params } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data, config } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://st.woread.com.cn/`,
        "origin": "http://st.woread.com.cn"
      },
      url: `http://st.woread.com.cn/touchextenernal/read/getBookList.action`,
      method: 'POST',
      jar,
      data: transParams({
        'bindType': '1',
        'categoryindex': '118440',
        'curpage': '1',
        'limit': '10',
        'pageIndex': '10843',
        'cardid': params.cardid
      })
    })
    return data.message
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

      let s = Math.floor(Math.random() * 20)
      console.log('等待%s秒再继续', s)
      await new Promise((resolve, reject) => setTimeout(resolve, s * 1000))
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
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `

    //密码加密
    var modulus = "00D9C7EE8B8C599CD75FC2629DBFC18625B677E6BA66E81102CF2D644A5C3550775163095A3AA7ED9091F0152A0B764EF8C301B63097495C7E4EA7CF2795029F61229828221B510AAE9A594CA002BA4F44CA7D1196697AEB833FD95F2FA6A5B9C2C0C44220E1761B4AB1A1520612754E94C55DC097D02C2157A8E8F159232ABC87";
    var exponent = "010001";
    var key = RSAUtils.getKeyPair(exponent, '', modulus);
    let phonenum = RSAUtils.encryptedString(key, options.user);


    let { config: m_config } = await axios.request({
      headers: {
        "user-agent": useragent,
        "X-Requested-With": "XMLHttpRequest"
      },
      url: `https://m.iread.wo.cn/touchextenernal/common/shouTingLogin.action`,
      method: 'POST',
      data: transParams({
        phonenum
      })
    })
    let m_jar = m_config.jar
    let cookiesJson = m_jar.toJSON()
    let diwert = cookiesJson.cookies.find(i => i.key == 'diwert')
    let useraccount = cookiesJson.cookies.find(i => i.key == 'useraccount')
    if (!useraccount || !diwert) {
      throw new Error('获取用户信息失败')
    }

    let { config: st_config } = await axios.request({
      headers: {
        "user-agent": useragent,
        "X-Requested-With": "XMLHttpRequest"
      },
      url: `http://st.woread.com.cn/touchextenernal/common/shouTingLogin.action`,
      method: 'POST',
      data: transParams({
        phonenum
      })
    })
    let st_jar = st_config.jar
    cookiesJson = st_jar.toJSON()
    diwert = cookiesJson.cookies.find(i => i.key == 'diwert')
    useraccount = cookiesJson.cookies.find(i => i.key == 'useraccount')
    if (!useraccount || !diwert) {
      throw new Error('获取用户信息失败')
    }

    return {
      st_jar,
      m_jar
    }
  },
  updatePersonReadtime: async (axios, options) => {
    const { detail, m_jar, st_jar } = options
    await dailyVideoBook.ajaxUpdatePersonReadtime(axios, {
      ...options,
      detail,
      jar: m_jar,
      time: 0
    })
    await dailyVideoBook.addDrawTimes(axios, {
      ...options,
      detail,
      jar: st_jar
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 500))
    await dailyVideoBook.updateReadTimes(axios, {
      ...options,
      detail,
      jar: m_jar
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 10 * 1000))
    await dailyVideoBook.ajaxUpdatePersonReadtime(axios, {
      ...options,
      detail,
      jar: m_jar,
      time: 2
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 500))
    await dailyVideoBook.addReadRatioToRedis(axios, {
      ...options,
      detail,
      jar: m_jar
    })

    await new Promise((resolve, reject) => setTimeout(resolve, 500))
    console.log('完成阅读时间上报')
  },
  ajaxUpdatePersonReadtime: async (axios, options) => {
    const { detail, jar, time } = options
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
        'time': time || 0
      })
    })
    console.log('ajaxUpdatePersonReadtime 完成')
  },
  updateReadTimes: async (axios, options) => {
    let { jar, detail } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
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
    console.log('updateReadTimes 完成')
  },
  addDrawTimes: async (axios, options) => {
    let { jar } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://st.woread.com.cn/`,
        "origin": "http://st.woread.com.cn",
        "X-Requested-With": "XMLHttpRequest"
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
        "origin": "http://m.iread.wo.cn",
        "X-Requested-With": "XMLHttpRequest"
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
  reportLatestRead: async (axios, options) => {
    let { jar, detail } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://st.woread.com.cn/`,
        "origin": "http://st.woread.com.cn",
        "X-Requested-With": "XMLHttpRequest"
      },
      url: `http://st.woread.com.cn/touchextenernal/contentread/reportLatestRead.action`,
      method: 'POST',
      jar,
      data: transParams({
        'chapterallindex': detail.chapterallindex,
        'cntindex': detail.cntindex
      })
    })
    console.log('reportLatestRead', data.message)
  },
  sltPreReadChapter: async (axios, options) => {
    let { jar, detail } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://st.woread.com.cn/`,
        "origin": "http://st.woread.com.cn",
        "X-Requested-With": "XMLHttpRequest"
      },
      url: `http://st.woread.com.cn/touchextenernal/contentread/sltPreReadChapter.action`,
      method: 'get',
      jar,
      params: transParams({
        'cntindex': detail.cntindex,
        'chapterseno': detail.chapterseno,
        'finishflag': '2',
        'beginchapter': '',
        'prenum': 1,
        'nextnum': 2,
        '_': new Date().getTime()
      })
    })
    console.log('sltPreReadChapter', data.curChapterTitle)
  },
  getActivityStatus: async (axios, options) => {
    let { jar, detail } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://st.woread.com.cn/`,
        "origin": "http://st.woread.com.cn",
        "X-Requested-With": "XMLHttpRequest"
      },
      url: `http://st.woread.com.cn/touchextenernal/thanksgiving/getActivityStatus.action`,
      method: 'POST',
      jar
    })
    console.log('getActivityStatus', data.message)
  },
  ajaxchapter: async (axios, options) => {
    let { jar, detail } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `http://st.woread.com.cn/`,
        "origin": "http://st.woread.com.cn",
        "X-Requested-With": "XMLHttpRequest"
      },
      url: `http://st.woread.com.cn/touchextenernal/contentread/ajaxchapter.action`,
      method: 'POST',
      jar,
      data: transParams({
        'cntindex': detail.cntindex,
        'catid': '0',
        'volumeallindex': detail.volumeallindex,
        'chapterallindex': detail.chapterallindex,
        'chapterseno': detail.chapterseno,
        'activityID': '',
        'pageIndex': '10782',
        'cardid': detail.cardid,
        '_': new Date().getTime()
      })
    })
    console.log('ajaxchapter innercode', data.innercode)
  },
  // 看视频领2积分
  read10doDrawLookVideoDouble: async (axios, options) => {
    let params = {
      'arguments1': 'AC20200521222721', // acid
      'arguments2': 'GGPD', // yhChannel
      'arguments3': '8e374761c0af4d9d9748ae9be7e5a3f8', // yhTaskId menuId
      'arguments4': new Date().getTime(), // time
      'arguments6': '',
      'netWay': 'Wifi',
      'version': `android@8.0100`
    }
    params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
    let { num, jar } = await require('./taskcallback').query(axios, {
      ...options,
      params
    })
    if (!num) {
      console.log('阅读满章抽奖得积分: 今日已完成')
      return
    }
    params = {
      'arguments1': 'AC20200521222721', // acid
      'arguments2': 'GGPD', // yhChannel
      'arguments3': '8e374761c0af4d9d9748ae9be7e5a3f8', // yhTaskId menuId
      'arguments4': new Date().getTime(), // time
      'arguments6': '',
      'arguments7': '',
      'arguments8': '',
      'arguments9': '',
      'orderId': crypto.createHash('md5').update(new Date().getTime() + '').digest('hex'),
      'netWay': 'Wifi',
      'remark': '阅读满章抽奖得积分',
      'remark1': '阅读满章抽奖得积分',
      'version': `android@8.0100`,
      'codeId': 945559732
    }
    params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
    await require('./taskcallback').doTask(axios, {
      ...options,
      params,
      jar
    })
  },
  read10doDraw: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `

    let Authorization = await dailyVideoBook.oauthMethod(axios, options)
    let { m_jar, st_jar } = await dailyVideoBook.login(axios, {
      ...options,
      Authorization
    })

    if (moment().isBefore(moment('2021-02-07'))) {
      await dailyVideoBook.readSignUp(axios, {
        ...options,
        jar: st_jar
      })
    }

    await dailyVideoBook.read10(axios, {
      ...options,
      m_jar,
      st_jar
    })

    let n = 1
    do {
      console.log(`第%s次抽奖`, n)
      let { data } = await axios.request({
        headers: {
          "user-agent": useragent,
          "referer": `http://st.woread.com.cn/`,
          "origin": "http://st.woread.com.cn",
          "X-Requested-With": "XMLHttpRequest"
        },
        url: `http://st.woread.com.cn/touchextenernal/thanksgiving/doDraw.action`,
        method: 'POST',
        jar: st_jar,
        data: 'acticeindex=MDMzMURDNTNDQzA0RDk5QTQ2RTI1RkQ5OEYwQzQ2RkI%3D'
      })
      if (data.code === '0000') {
        console.log('read10doDraw 成功', data.prizedesc)
      } else {
        console.log('read10doDraw 失败', data.message)
        if (data.innercode === '9148') {
          break
        }
      }
      ++n
      console.log('等待3秒')
      await new Promise((resolve, reject) => setTimeout(resolve, 3000))
    } while (n <= 5)
  },
  // 阅读拉力赛报名
  readSignUp: async (axios, options) => {
    let { jar } = options
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let { data } = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `https://st.woread.com.cn/touchextenernal/readrally/index.action?channelid=18000698&yw_code=&desmobile=${options.user}&version=android@8.010`,
        "origin": "http://st.woread.com.cn",
        "X-Requested-With": "XMLHttpRequest"
      },
      url: `https://st.woread.com.cn/touchextenernal/readrally/signUp.action`,
      method: 'POST',
      jar
    })
    console.log('getSignUpStatus', data.message)
  },
  read10: async (axios, options) => {
    const { st_jar, m_jar } = options

    let cardid = '11910'
    console.log('取得书籍列表')
    let books = await dailyVideoBook.getBookList(axios, {
      ...options,
      jar: st_jar,
      params: {
        cardid
      }
    })

    let m = 5
    do {
      let book = books[Math.floor(Math.random() * books.length)]
      console.log('随机获取', book.cntname)

      let n = 12
      let chapterseno = 1

      do {

        let chapters = await dailyVideoBook.getBookUpDownChapter(axios, {
          ...options,
          jar: st_jar,
          book,
          chapter: {
            chapterseno
          }
        })


        chapter = chapters[chapters.length - 2]

        chapterseno = chapters[chapters.length - 1].chapterseno

        console.log(chapter.chaptertitle)

        let detail = {
          'cntindex': book.cntindex,
          'catid': '118440',
          'pageIndex': '10843',
          'cardid': cardid,
          'desmobile': options.user,
          'version': 'android@8.0100',
          'cntname': book.cntname,
          'channelid': '18000018',
          'chapterallindex': chapter.chapterallindex,
          'volumeallindex': chapter.volumeallindex,
          'chapterseno': chapter.chapterseno,
          'cntid': chapter.cntid,
          'cnttype': book.cnttype
        }

        await dailyVideoBook.reportLatestRead(axios, {
          ...options,
          detail,
          jar: st_jar
        })

        await dailyVideoBook.updatePersonReadtime(axios, {
          ...options,
          detail,
          st_jar: st_jar,
          m_jar: m_jar
        })

        await dailyVideoBook.sltPreReadChapter(axios, {
          ...options,
          detail,
          jar: st_jar
        })

        await dailyVideoBook.ajaxchapter(axios, {
          ...options,
          detail,
          jar: st_jar
        })

        console.log('等待3秒')
        await new Promise((resolve, reject) => setTimeout(resolve, 3000))
      } while (--n)

      console.log('阅读10章完成')

    } while (--m)

    console.log('阅读5本书完成')
  },
  giftBoints: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    let res = await axios.request({
      headers: {
        "user-agent": useragent,
        "referer": `https://img.client.10010.com/`,
        "origin": "https://img.client.10010.com"
      },
      url: `https://act.10010.com/SigninApp/floorData/getIntegralFree`,
      method: 'POST',
      data: transParams({
        'type': 'readNovel'
      })
    })

    let result = res.data

    let taskList = []

    if (result.status !== '0000') {
      console.log('出现错误', result.msg)
      return
    } else {
      taskList = result.data.taskList
    }

    let ts = taskList.find(t => t.templateCode === 'mll_dxs')
    if (ts) {
      if (ts.action === 'API_YILINGQU') {
        console.log('出现错误', '已经领取过')
        return
      }
    } else {
      console.log('出现错误', '不存在的活动')
      return
    }

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