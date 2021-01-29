var crypto = require('crypto');
var moment = require('moment');

// 开心抓大奖
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

var dailyGrabdollPage = {
    getState: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`
        const { searchParams, ecs_token } = options
        let phone = encryption(options.user, 'gb6YCccUvth75Tm2')
        let timestamp = moment().format('YYYYMMDDHHmmss')
        let { data, config } = await axios.request({
            headers: {
                "user-agent": useragent,
                "referer": `https://wxapp.msmds.cn/h5/react_web/unicom/grabdollPage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbKHR&userNumber=${options.user}`,
            },
            url: `https://wxapp.msmds.cn/jplus/api/channelGrabDoll/index`,
            method: 'POST',
            data: transParams({
                'channelId': 'LT_channel',
                "phone": phone,
                'token': ecs_token,
                'sourceCode': 'lt_zhuawawa'
            })
        })
        if (data.code !== 200) {
            console.log('获取任务状态失败')
            return {
                jar: config.jar,
                state: false
            }
        } else {
            return {
                jar: config.jar,
                state: data.data.grabDollAgain
            }
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
            url: `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/grabdollPage?source=unicom&duanlianjieabc=tbKHR`,
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
        let { state, jar: gjar } = await dailyGrabdollPage.getState(axios, {
            ...options,
            ecs_token,
            searchParams
        })
        if (!state) {
            console.log('任务已完成，明日再来')
            return
        }
        let phone = encryption(options.user, 'gb6YCccUvth75Tm2')
        let times = 5
        do {

            if (times < 5) {
                let params = {
                    'arguments1': 'AC20200624091508',
                    'arguments2': 'GGPD',
                    'arguments3': '734225b6ec9946cca3bcdc6a6e14fc1f',
                    'arguments4': new Date().getTime(),
                    'arguments6': '',
                    'arguments7': '',
                    'arguments8': '',
                    'arguments9': '',
                    'netWay': 'Wifi',
                    'remark': '签到看视频得积分2',
                    'remark1': '签到看视频得积分2',
                    'version': `android@8.0100`,
                    'codeId': 945474727
                }

                params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
                params['orderId'] = crypto.createHash('md5').update(new Date().getTime() + '').digest('hex')
                params['arguments4'] = new Date().getTime()

                let result = await require('./taskcallback').reward(axios, {
                    ...options,
                    params,
                    jar: jar1
                })
                let a = {
                    'channelId': 'LT_channel',
                    "phone": phone,
                    'token': ecs_token,
                    'sourceCode': 'lt_zhuawawa'
                }

                let timestamp = moment().format('YYYYMMDDHHmmss')
                result = await axios.request({
                    headers: {
                        "user-agent": useragent,
                        "referer": `https://wxapp.msmds.cn/h5/react_web/unicom/grabdollPage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbKHR&userNumber=${options.user}`,
                        "origin": "https://wxapp.msmds.cn"
                    },
                    jar: gjar,
                    url: `https://wxapp.msmds.cn/jplus/api/channelGrabDoll/playAgainByLookingVideos`,
                    method: 'POST',
                    data: transParams(a)
                })

                if (result.data.code !== 200) {
                    console.log('提交任务失败', result.data.msg)
                } else {
                    console.log('提交任务成功', `${result.data.data}`)
                }

            }

            let timestamp = moment().format('YYYYMMDDHHmmss')
            let res = await axios.request({
                headers: {
                    "user-agent": useragent,
                    "referer": `https://wxapp.msmds.cn/h5/react_web/unicom/grabdollPage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbKHR&userNumber=${options.user}`,
                },
                jar: gjar,
                url: `https://wxapp.msmds.cn/jplus/api/channelGrabDoll/startGame`,
                method: 'POST',
                data: transParams({
                    'channelId': 'LT_channel',
                    "phone": phone,
                    'token': ecs_token,
                    'sourceCode': 'lt_zhuawawa'
                })
            })

            let result = res.data
            if (result.code === 200) {
                console.log('阅读开心抓大奖', result.data.goodsName)
            } else {
                console.log('阅读开心抓大奖', result.msg)
            }

            console.log('等待15秒再继续')
            await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000))

        } while (--times)
    }
}

module.exports = dailyGrabdollPage