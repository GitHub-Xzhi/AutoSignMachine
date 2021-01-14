
var crypto = require('crypto');
var CryptoJS = require("crypto-js");
const { RSAUtils } = require('./RSAUtils');

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

var dailyBookLuckdraw = {
    seeadvertluckdraw: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let res = await axios.request({
            headers: {
                "user-agent": useragent,
            },
            url: `http://m.iread.wo.cn/touchextenernal/seeadvertluckdraw/index.action?channelid=18000018&yw_code=&desmobile=${options.user}&version=android@8.0100`,
            method: 'GET'
        })

        let cookiesJson = res.config.jar.toJSON()
        let diwert = cookiesJson.cookies.find(i => i.key == 'diwert')
        let useraccount = cookiesJson.cookies.find(i => i.key == 'useraccount')
        let jar = res.config.jar
        if (!useraccount || !diwert) {
            //密码加密
            var modulus = "00D9C7EE8B8C599CD75FC2629DBFC18625B677E6BA66E81102CF2D644A5C3550775163095A3AA7ED9091F0152A0B764EF8C301B63097495C7E4EA7CF2795029F61229828221B510AAE9A594CA002BA4F44CA7D1196697AEB833FD95F2FA6A5B9C2C0C44220E1761B4AB1A1520612754E94C55DC097D02C2157A8E8F159232ABC87";
            var exponent = "010001";
            var key = RSAUtils.getKeyPair(exponent, '', modulus);
            let phonenum = RSAUtils.encryptedString(key, options.user);

            let res = await axios.request({
                headers: {
                    "user-agent": useragent
                },
                url: `http://m.iread.wo.cn/touchextenernal/common/shouTingLogin.action`,
                method: 'POST',
                data: transParams({
                    phonenum
                })
            })
            jar = res.config.jar
        }

        return {
            jar
        }
    },
    doTask: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        const { jar } = await dailyBookLuckdraw.seeadvertluckdraw(axios, options)
        let times = 5
        do {
            if (times < 5) {
                let params = {
                    'arguments1': 'AC20200521222721',
                    'arguments2': 'GGPD',
                    'arguments3': '',
                    'arguments4': new Date().getTime(),
                    'arguments6': '',
                    'arguments7': '',
                    'arguments8': '',
                    'arguments9': '',
                    'netWay': 'Wifi',
                    'remark': '阅读每日读书福利广告1',
                    'remark1': '阅读每日读书福利广告1',
                    'version': `android@8.0100`,
                    'codeId': 945535424
                }

                params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
                params['orderId'] = crypto.createHash('md5').update(new Date().getTime() + '').digest('hex')
                params['arguments4'] = new Date().getTime()

                let result = await require('./taskcallback').reward(axios, {
                    ...options,
                    params,
                    jar
                })
            }

            let res = await axios.request({
                headers: {
                    "user-agent": useragent,
                },
                url: `http://m.iread.wo.cn/touchextenernal/seeadvertluckdraw/doDraw.action`,
                method: 'POST',
                data: transParams({
                    'acticeindex': 'NzJBQTQxMEE2QzQwQUE2MDYxMEI5MDNGQjFEMEEzODI='
                }),
                jar
            })
            let result = res.data
            if (result.code === '0000') {
                console.log('阅读每日读书福利抽奖', result.prizedesc)
            } else if (result.code === '9999') {
                console.log('阅读每日读书福利抽奖', result.message)
                break
            } else {
                console.log('阅读每日读书福利抽奖', result.message)
            }

            console.log('等待15秒再继续')
            await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000))

        } while (--times)
    }
}

module.exports = dailyBookLuckdraw