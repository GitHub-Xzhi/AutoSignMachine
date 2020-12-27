const Qs = require("qs");
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

transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data['' + item + '']);
  }
  return params;
};

var chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
function generateMixed (n) {
  let res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 61);
    res += chars[id];
  }
  return res;
}

module.exports = (axios, options) => {
  const useragent = `okhttp/4.4.0`
  const deviceId = generateMixed(15)
  var data = {
    // ChinaunicomMobileBusiness
    'appId': options.appid,
    'deviceBrand': 'samsung',
    'deviceCode': deviceId,
    'deviceId': deviceId,
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
  return new Promise((resolve, reject) => {
    axios.request({
      baseURL: 'https://m.client.10010.com',
      headers: {
        "user-agent": useragent,
        "referer": "https://m.client.10010.com",
        "origin": "https://m.client.10010.com"
      },
      url: `/mobileService/login.htm`,
      method: 'post',
      data: transParams(data)
    }).then(res => {
      resolve(res.data)
    }).catch(console.log)
  })
}