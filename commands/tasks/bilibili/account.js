var crypto = require('crypto');
const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const { getCookies, saveCookies } = require('../../../utils/util')

const app_key = 'bca7e84c2d947ac6'
var calc_sign = (params) => {
  let str = `${params}60698ba2f68e01ce44738920a0ffe768`
  return crypto.createHash('md5').update(str).digest('hex');
}
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
// 创建加密算法
const rsapublicKeyEncode = function (data, publicKey) {
  let crypted = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PADDING
  }, Buffer.from(data)).toString('base64');
  return crypted;
};
var account = {
  tokenFile: path.join(os.homedir(), '.AutoSignMachine', 'tokenFile.json'),
  getLoginPublicKey: async (axios) => {
    let res = await axios.request({
      headers: {
        "referer": "https://passport.bilibili.com/",
        "origin": "https://passport.bilibili.com",
      },
      url: `https://passport.bilibili.com/api/oauth2/getKey`,
      method: 'post',
      data: transParams({
        appkey: app_key,
        sign: calc_sign(`appkey=${app_key}`)
      })
    })
    let result = res.data
    if (result.code !== 0) {
      throw new Error('获取公钥失败')
    }
    return result.data
  },
  getCaptcha: async (axios) => {
    let res = await axios.request({
      headers: {
        "referer": "https://passport.bilibili.com/",
        "origin": "https://passport.bilibili.com",
      },
      responseType: "arraybuffer",
      url: `https://passport.bilibili.com/captcha`,
      method: 'get'
    })
    return Buffer.from(
      new Uint8Array(res.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      ), 'binary').toString('base64')
  },
  getCrackCaptcha: async (axios, image_base64) => {
    let res = await axios.request({
      headers: {
        "user-agent": "Mozilla/5.0 BiliDroid/6.4.0 (bbcallen@gmail.com) os/android model/M1903F11I mobi_app/android build/6040500 channel/bili innerVer/6040500 osVer/9.0.0 network/2",
        "referer": "https://bili.dev/",
        "origin": "https://bili.dev",
        "Content-Type": 'application/json'
      },
      url: `https://bili.dev:2233/captcha`,
      method: 'post',
      data: {
        image: image_base64
      }
    })
    let result = res.data
    if (result.code !== 0) {
      throw new Error('获取验证码识别结果失败')
    }
    return result.message
  },
  getInfoByTokenAndSetCookies: async (axios, options) => {
    const { mid, access_token } = options
    var params = {
      access_key: access_token,
      appkey: app_key,
      ts: new Date().getTime()
    }
    let sign = calc_sign(w(params))
    let res = await axios.request({
      headers: {
        "referer": "https://passport.bilibili.com/",
        "origin": "https://passport.bilibili.com",
      },
      url: `https://passport.bilibili.com/api/v2/oauth2/info?` + w(params) + '&sign=' + sign,
      method: 'get'
    })

    params = {
      access_key: access_token,
      appkey: app_key,
      gourl: "https://account.bilibili.com/account/home",
      ts: new Date().getTime()
    }
    sign = calc_sign(w(params))
    res = await axios.request({
      headers: {
        "cookie": res.config.headers.cookie + ";DedeUserID=" + mid,
        "referer": "https://passport.bilibili.com/",
        "origin": "https://passport.bilibili.com",
      },
      url: `https://passport.bilibili.com/api/login/sso?` + w(params) + '&sign=' + sign,
      method: 'get'
    })
    if (res.status !== 200) {
      throw new Error('获取登录状态失败')
    } else {
      const { config } = res
      await saveCookies('bilibili_' + (options.username || 'default'), '', config.jar)
    }
  },
  loginByPassword: async (axios, options) => {
    account.tokenFile = path.join(os.homedir(), '.AutoSignMachine', 'tokenFile_bilibili_' + (options.username || 'default') + '.json')
    let tokenJson
    if (fs.existsSync(account.tokenFile)) {
      let token = JSON.parse(fs.readFileSync(account.tokenFile).toString('utf-8'))
      let time = new Date().getTime()
      // 将过期
      if (token.expires_in < time + 60 * 60 * 24 && token.expires_in > time) {
        // TODO 刷新token
        tokenJson = token
      } else if (token.expires_in > time) {
        tokenJson = token
      } else {
        // 过期不处理
      }
    }
    if (tokenJson) {
      await account.getInfoByTokenAndSetCookies(axios, {
        ...options,
        ...tokenJson
      })
      return tokenJson
    }
    let { key, hash } = await account.getLoginPublicKey(axios)
    let img = await account.getCaptcha(axios)
    let captcha = await account.getCrackCaptcha(axios, img)
    var params = {
      actionKey: 'appkey',
      appkey: app_key,
      captcha: captcha,
      password: rsapublicKeyEncode(hash + options.password, key.toString('ascii')),
      username: options.username
    }
    let sign = calc_sign(w(params))

    let res = await axios.request({
      headers: {
        "referer": "https://passport.bilibili.com/",
        "origin": "https://passport.bilibili.com",
      },
      url: `https://passport.bilibili.com/api/v2/oauth2/login`,
      method: 'post',
      data: transParams(params) + '&sign=' + sign
    })
    if (res.data.code === -449) {
      // 服务繁忙，更换api登录
      params = {
        access_key: '',
        actionKey: 'appkey',
        appkey: app_key,
        build: 6040500,
        captcha: captcha,
        challenge: '',
        channel: 'bili',
        cookies: '',
        device: 'phone',
        mobi_app: 'android',
        password: rsapublicKeyEncode(hash + options.password, key.toString('ascii')),
        permission: 'ALL',
        platform: 'android',
        seccode: '',
        subid: 1,
        ts: new Date().getTime(),
        username: options.username,
        validate: ''
      }
      sign = calc_sign(w(params))
      res = await axios.request({
        headers: {
          "referer": "https://passport.bilibili.com/",
          "origin": "https://passport.bilibili.com",
        },
        url: `https://passport.bilibili.com/api/v3/oauth2/login`,
        method: 'post',
        data: transParams(params) + '&sign=' + sign
      })
    }
    if (res.data.code !== 0) {
      throw new Error(res.data.message)
    }
    if (res.data.data.status === 2) {
      throw new Error(res.data.data.message)
    }
    tokenJson = {
      ...res.data.data.token_info,
      expires_in: res.data.data.token_info.expires_in + new Date().getTime()
    }
    fs.ensureFileSync(account.tokenFile)
    fs.writeFileSync(account.tokenFile, JSON.stringify(tokenJson))
    await account.getInfoByTokenAndSetCookies(axios, {
      ...options,
      ...tokenJson
    })
    return tokenJson
  }
}
module.exports = account
