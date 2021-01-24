const { getCookies, saveCookies } = require('../../../utils/util')
var crypto = require('crypto');
var moment = require('moment');
moment.locale('zh-cn');
// 联通APP版本
const unicom_version = '8.0100'

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDc+CZK9bBA9IU+gZUOc6
FUGu7yO9WpTNB0PzmgFBh96Mg1WrovD1oqZ+eIF4LjvxKXGOdI79JRdve9
NPhQo07+uqGQgE4imwNnRx7PFtCRryiIEcUoavuNtuRVoBAm6qdB0Srctg
aqGfLgKvZHOnwTjyNqjBUxzMeQlEC2czEMSwIDAQAB
-----END PUBLIC KEY-----`.toString('ascii')

// 创建加密算法
const rsapublicKeyEncode = function (data) {
  let crypted = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, Buffer.from(data)).toString('base64');
  return crypted;
};

var transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data['' + item + '']);
  }
  return params;
};

var chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
function generateMixed(n) {
  let res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 61);
    res += chars[id];
  }
  return res;
}

module.exports = async (axios, params) => {
  let { cookies, options } = params
  const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
  let token_online
  let appId
  let data

  if (cookies) {
    let res = await axios.request({
      baseURL: 'https://m.client.10010.com',
      headers: {
        "user-agent": useragent,
        "referer": "https://m.client.10010.com",
        "origin": "https://m.client.10010.com"
      },
      url: `/mobileService/customer/query/getMyUnicomDateTotle.htm`,
      method: 'post'
    })
    data = res.data
    config = res.config
    let cookiesJson = config.jar.toJSON()
    token_online = cookiesJson.cookies.find(i => i.key == 'token_online')
    if (token_online) {
      token_online = token_online.value
    } else {
      token_online = undefined
    }
    appId = cookiesJson.cookies.find(i => i.key == 'appId')
    if (appId) {
      appId = appId.value || options.appid
    } else {
      appId = undefined
    }
  }

  if (Object.prototype.toString.call(data) !== '[object Object]' || !data || !('phone' in data)) {
    console.log('cookies凭据访问失败，将使用账户密码登录')
    if (!('appid' in options) || !options['appid']) {
      throw new Error("需要提供appid")
    }
    if (options['user']) {
      if (!('password' in options) || !options['password']) {
        throw new Error("需要提供登陆密码")
      }
    } else if (!cookies) {
      throw new Error("需要提供登录信息，使用密码账号或者cookies")
    }
    const deviceId = generateMixed(15)
    var params = {
      // ChinaunicomMobileBusiness
      'appId': appId || options.appid,
      'deviceBrand': 'samsung',
      'deviceCode': deviceId + '',
      'deviceId': deviceId + '',
      'deviceModel': 'SM-G977N',
      'deviceOS': 'android7.1.2',
      'isRemberPwd': 'true',
      'keyVersion': '',
      'mobile': rsapublicKeyEncode(options.user),
      'netWay': 'Wifi',
      'password': rsapublicKeyEncode(options.password),
      'pip': '172.16.70.15',
      'provinceChanel': 'general',
      'simCount': '0',
      'timestamp': moment().format('YYYYMMDDHHmmss'),
      'version': `android@${unicom_version}`,
      'yw_code': ''
    }
    const { data, config } = await axios.request({
      baseURL: 'https://m.client.10010.com',
      headers: {
        "user-agent": useragent,
        "referer": "https://m.client.10010.com",
        "origin": "https://m.client.10010.com"
      },
      url: `/mobileService/login.htm`,
      method: 'post',
      data: transParams(params)
    })
    if (data.code !== '0') {
      throw new Error('登陆失败:' + data.dsc)
    }
    cookies = 'token_online=' + data.token_online + '; appId=' + data.appId
    await saveCookies('unicom_' + (options.user || 'default'), cookies, config.jar)
    console.log('获得登录状态成功')
  } else {
    const deviceId = generateMixed(15)
    var params = {
      'appId': appId,
      'deviceBrand': 'samsung',
      'deviceCode': deviceId,
      'deviceId': deviceId,
      'deviceModel': 'SM-G977N',
      'deviceOS': 'android7.1.2',
      'netWay': 'Wifi',
      'platformToken': '0867442035025655300000391200CN01',
      'pushPlatform': 'samsung',
      'reqtime': new Date().getTime(),
      'token_online': token_online,
      'version': `android@${unicom_version}`,
    }
    if (!params.appId) {
      throw new Error('appId参数无效')
    }
    if (!params.token_online) {
      throw new Error('token_online参数无效')
    }
    const { data, config } = await axios.request({
      baseURL: 'https://m.client.10010.com',
      headers: {
        "user-agent": useragent,
        "referer": "https://m.client.10010.com",
        "origin": "https://m.client.10010.com"
      },
      url: `/mobileService/onLine.htm`,
      method: 'post',
      data: transParams(params)
    }).catch(err => console.log(err))

    if (data.code !== '0') {
      console.log(data.dsc)
    }
    cookies += '; token_online=' + data.token_online + '; appId=' + data.appId
    await saveCookies('unicom_' + (options.user || 'default'), cookies, config.jar)
    console.log('获得登录状态成功')
  }
}