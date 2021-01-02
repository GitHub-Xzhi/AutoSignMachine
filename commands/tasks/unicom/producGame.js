// TODO !!!!! 签名算法暂未知
// 娱乐中心
const fs = require('fs')
const path = require('path')

var transParams = (data) => {
    let params = new URLSearchParams();
    for (let item in data) {
        params.append(item, data['' + item + '']);
    }
    return params;
};
// https://img.client.10010.com/gametask/index.html#/
// 积分活动相关业务参数
let account = {
    "androidCodeId": "945188116",
    "iosCodeId": "945188122",
    "acId": "AC20200728150217",
    "taskId": "96945964804e42299634340cd2650451",
    "remark": "游戏视频任务积分",
    "channel": "GGPD",
    "channelName": "游戏视频任务积分",
    "unWantedToast": false,
    "unWantedToast2": true, "rewards": true,
    "codeId": "945535736",
    "action": "showVideoAd"
}

module.exports = {
    // 娱乐中心每日签到-打卡
    gameSignin: (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let data = {
            'methodType': 'signin'
        }
        return new Promise((resolve, reject) => {
            axios.request({
                baseURL: 'https://m.client.10010.com/',
                headers: {
                    "user-agent": useragent,
                    "referer": "https://img.client.10010.com",
                    "origin": "https://img.client.10010.com"
                },
                url: `/producGame_signin`,
                method: 'post',
                data: transParams(data)
            }).then(res => {
                let result = res.data
                if (result) {
                    if (result.respCode !== '0000') {
                        console.log('娱乐中心每日签到失败', result.respDesc)
                    } else {
                        console.log('娱乐中心每日签到获得+' + result.currentIntegral)
                    }
                } else {
                    console.log('娱乐中心每日签到失败')
                }
                resolve()
            }).catch(reject)
        })
    },
    // 娱乐中心-每日任务
    tasks: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'methodType': 'queryTaskCenter',
            'deviceType': 'Android',
            'clientVersion': '8.0100'
        }
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `/producGameTaskCenter`,
            method: 'post',
            data: transParams(params)
        })
        if (data) {
            if (data.code !== '0000') {
                console.log('娱乐中心', data.respDesc)
            } else {
                return data.data
            }
        } else {
            console.log('娱乐中心每日签到失败')
        }
    },
    // 娱乐中心-游戏宝箱
    // gamebox: async (axios, options) => {
    //     const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
    //     let params = {
    //         'methodType': 'taskGetReward',
    //         'deviceType': 'Android',
    //         'clientVersion': '8.0100',
    //         'taskCenterId': 98
    //     }
    //     let { data } = await axios.request({
    //         baseURL: 'https://m.client.10010.com/',
    //         headers: {
    //             "user-agent": useragent,
    //             "referer": "https://img.client.10010.com",
    //             "origin": "https://img.client.10010.com"
    //         },
    //         url: `/producGameTaskCenter`,
    //         method: 'post',
    //         data: transParams(params)
    //     })
    //     if (data) {
    //         if (data.code !== '0000') {
    //             console.log('娱乐中心：', data.msg)
    //         } else {
    //             console.log('娱乐中心：宝箱领取成功')
    //         }
    //     } else {
    //         console.log('娱乐中心：宝箱领取失败')
    //     }
    // },
    recordGame: async (axios, options) => {
        const { gameId } = options
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'methodType': 'record',
            'deviceType': 'Android',
            'taskId': '0',
            'gameId': gameId
        }
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `/producGameApp`,
            method: 'post',
            data: transParams(params)
        })
        if (data) {
            console.log(data.msg)
        } else {
            console.log('记录失败')
        }
    },
    popularGames: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'methodType': 'popularGames',
            'deviceType': 'Android',
            'clientVersion': '8.0100',
        }
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `/producGameApp`,
            method: 'post',
            data: transParams(params)
        })
        if (data) {
            return data.popularList || []
        } else {
            console.log('记录失败')
        }
    },
    recordGame1: async (axios, options) => {
        const { gameId } = options
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'methodType': 'iOSTaskRecord',
            'gameId': gameId
        }
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `/producGameApp`,
            method: 'post',
            data: transParams(params)
        })
        if (data) {
            console.log(data.msg)
        } else {
            console.log('记录失败')
        }
    },
    gameverify: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let jwt = undefined
        axios.defaults.headers.cookie.split('; ').forEach(item => {
            if (item.indexOf('jwt') === 0) {
                jwt = item.split("=").pop()
            }
        })
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": "okhttp/4.4.0",
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `/game/verify`,
            method: 'post',
            data: {
                "extInfo": jwt,
                "auth": {
                    "uin": options.user,
                    "sig": jwt
                }
            }
        })
        if (data) {
            if (data.respCode !== 0) {
                console.log(data.errorMessage)
            }
        } else {
            console.log('记录失败')
        }
    },
    timeTaskQuery: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'methodType': 'timeTaskQuery',
            'deviceType': 'Android',
            'clientVersion': '8.0100'
        }
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `/producGameApp`,
            method: 'post',
            data: transParams(params)
        })
        if (data) {
            console.log(data.msg)
            return data.data.filter(g => g.state === '0')//0未进行 state=1待领取 state=2已完成
        } else {
            console.log('记录失败')
        }
    },
    reportTimeEvent: async (axios, options) => {
        const { game, app, action, launchid } = options

        let launchtime = options.launchtime

        let jwt = undefined
        axios.defaults.headers.cookie.split('; ').forEach(item => {
            if (item.indexOf('jwt') === 0) {
                jwt = item.split("=").pop()
            }
        })
        let buf_tpl = await new Promise((resolve, reject) => {
            fs.readFile(path.resolve(path.join(__dirname, './reportTimeEvent.bin')), function (err, bytesRead) {
                if (err) throw err;
                resolve(bytesRead);
            })
        })
        var buf = buf_tpl.slice(0, 0x85)

        // user
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x9B)])

        // appid
        let appid = game.gameCode
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xB3)])

        // launchid
        // let launchid = new Date().getTime()
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xE2)])

        // launch time
        time = launchtime + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x37A)])

        // uid
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x390)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3A8)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3DA)])

        // loaded time
        time = launchtime + 45 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x6A7)])

        // uid
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x6BD)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x6D5)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x709)])

        // launch_result
        time = launchtime + 50 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x9D7)])

        // uid
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x9ED)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xA05)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xA35)])

        // appcreate time
        time = launchtime + 60 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xCCD)])

        // uid
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xCE3)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xCFB)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xD2A)])

        // onlaunch time
        time = launchtime + 70 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xFC2)])

        // uid
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xFD8)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xFF0)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1022)])

        // apponloaded time
        time = launchtime + 80 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x12EF)])

        // uid
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1305)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x131D)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1351)])

        // launch_result time
        time = launchtime + 90 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x161F)])

        // uid
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1635)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x164D)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1682)])

        // fpsPerformance time
        time = launchtime + 100 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x191B)])

        // uid
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1931)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1949)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1979)])

        // apponshow time
        time = launchtime + 200 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1C11)])

        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1C27)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1C3F)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1C79)])

        // request_result time
        time = launchtime + 210 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1F29)])

        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1F3F)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1F57)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x1F91)])

        // request_result time
        time = launchtime + 220 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2241)])

        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2257)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x226F)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x22A9)])

        // request_result time
        time = launchtime + 230 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x255D)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2573)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x258B)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x25C5)])

        // request_result time
        time = launchtime + 240 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2873)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2889)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x28A1)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x28DB)])

        // request_result time
        time = launchtime + 250 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2B89)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2B9F)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2BB7)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2BED)])

        // web_socket_open time
        time = launchtime + 200 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2E9B)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2EB1)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2EC9)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x2F03)])

        // web_socket_open time
        time = launchtime + 210 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x31B1)])

        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x31C7)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x31DF)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3219)])

        // web_socket_open time
        time = launchtime + 223 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x34C7)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x34DD)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x34F5)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x352F)])

        // web_socket_open time
        time = launchtime + 300 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x37DD)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x37F3)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x380B)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3849)])

        // web_socket_open time
        time = launchtime + 253 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3AE1)])

        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3AF7)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3B0F)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3B46)])

        // staytime
        time = new Date().getTime() + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3DE3)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3DF9)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3E11)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x3E46)])

        // web_socket_open time
        time = launchtime + 300 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x40E2)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x40F8)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4110)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4148)])

        // memoryPerformance time
        time = launchtime + 350 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x43E5)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x43FB)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4413)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4446)])

        // memoryGrowth time
        time = launchtime + 360 + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x46E3)])


        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x46F9)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4711)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4741)])

        // apponhide time
        time = new Date().getTime() + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x49D2)])


        // custom
        buf_tmp = Buffer.from(`${options.user}_0101180709792_111872`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4A1C)])

        // user
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4A2A)])

        // jwt
        buf_tmp = Buffer.from(`${jwt}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4B06 + 1)])

        let res = await axios.request({
            headers: {
                "user-agent": "okhttp/4.4.0"
            },
            url: `https://q.qq.com/mini/OpenChannel?Action=input&Nonce=398869370&PlatformID=2001&SignatureMethod=HmacSHA256&Timestamp=1609563639&Signature=Rb5qMy2IDStlH2nzEd2ivrZvLJIVfCVBtuYfFBMXp3E%3D`,
            method: 'post',
            responseType: 'arrayBuffer',
            data: buf
        }, {
            jar: null
        }).catch(err => console.log(err))
        console.log(Buffer.from(res.data))

        // let result = Buffer.from(res.data).toString('base64')
        // let pre = Buffer.from([0x08, 0xB4, 0x01]).toString('base64')
        // if (result === pre) {
        //     console.log('reportTransfer成功')
        // }

        console.log('reportTimeEvent完成')

        // await new Promise((resolve, reject) => {
        //     fs.writeFile('./reportTime_bin', buf, function (err) {
        //         if (err) throw err;
        //         resolve();
        //     })
        // })
    },
    reportTransfer: async (axios, options) => {
        const { game, app, action } = options
        let launchid = options.launchid

        let jwt = undefined
        axios.defaults.headers.cookie.split('; ').forEach(item => {
            if (item.indexOf('jwt') === 0) {
                jwt = item.split("=").pop()
            }
        })

        var buf_tpl = Buffer.from("CFcSIFYxX0FORF9NSU5JU0RLXzEuNS4zXzBfUkVMRUFTRV9CGkttPVZLWS1BTDAwJm89OSZhPTI4JnA9MTA4MCoxOTIwJmY9SFVBV0VJJm1tPTU3MjUmY2Y9MTgwMCZjYz04JnFxdmVyc2lvbj04LjEitBYKtAcIDBISCgN1aW4SCzE3NTg1OTIwODY1EgkKBXRvdWluEgASGgoJdGltZXN0YW1wEg0xNjA5NTAwMDgyNjg2Ei0KCXFxdmVyc2lvbhIgVjFfQU5EX01JTklTREtfMS41LjNfMF9SRUxFQVNFX0ISBgoEaW1laRIICgRpZGZhEgASCAoEaWRmdhIAEh4KCmFuZHJvaWRfaWQSEDI4YjJkODllMzBmZDIwNmUSGQoIbGF1bmNoaWQSDTE2MDk1MDAwODI2ODISEwoFYXBwaWQSCjExMTEwMjk5MjYSFAoLYXBwX3ZlcnNpb24SBTEuMS4xEhQKEmFwcF9jbGFzc2lmaWNhdGlvbhILCgdhcHBfdGFnEgASEwoOaXNQa2dEb3dubG9hZWQSATESEAoLaXNYNUVuYWJsZWQSATASDwoKYXBwX3N0YXR1cxIBMxIGCgRwYXRoEhAKBXJlZmVyEgdsdF8xMDAxEhcKCmFjdGlvbnR5cGUSCXBhZ2VfdmlldxIYCg5zdWJfYWN0aW9udHlwZRIGMmNsaWNrEhcKD3Jlc2VydmVzX2FjdGlvbhIEbnVsbBIRCglyZXNlcnZlczISBG51bGwSHQoJcmVzZXJ2ZXMzEhBTREtfaGFzWDVfaGFzUGtnEhEKCXJlc2VydmVzNBIEbnVsbBIRCglyZXNlcnZlczUSBG51bGwSEQoJcmVzZXJ2ZXM2EgRudWxsEg0KCGFwcF90eXBlEgEwEiAKC3Nka192ZXJzaW9uEhExLjYuMTFfMThfOTJhNmQwYRIaCg9kZXZpY2VfcGxhdGZvcm0SB2FuZHJvaWQSFgoMZGV2aWNlX21ha2VyEgZIVUFXRUkSGAoMZGV2aWNlX21vZGVsEghWS1ktQUwwMBITCg5kZXZpY2VfdmVyc2lvbhIBORIUCgxuZXR3b3JrX3R5cGUSBHdpZmkSFgoSbmV0d29ya19nYXRld2F5X2lwEgASHQoMbmV0d29ya19zc2lkEg1DaGluYU5ldC1rYVNwEhsKBWdwc194EhIyNi42MTE5NjMyMTI1OTE4MjgSGgoFZ3BzX3kSETEwNi42MzUyODE2NDIyNzA4EhIKCnNvdXJjZV9hcHASBDIwMDESFQoOc291cmNlX3ZlcnNpb24SAzguMRIgChNzb3VyY2VfdWluX3BsYXRmb3JtEglhbm9ueW1vdXMSEAoOY29ubmVjdF9vcGVuaWQSEQoMY29ubmVjdF90eXBlEgEwEgwKCmN1c3RvbUluZm8KvQcIDBISCgN1aW4SCzE3NTg1OTIwODY1EgkKBXRvdWluEgASGgoJdGltZXN0YW1wEg0xNjA5NTAwMDgyNzgzEi0KCXFxdmVyc2lvbhIgVjFfQU5EX01JTklTREtfMS41LjNfMF9SRUxFQVNFX0ISBgoEaW1laRIICgRpZGZhEgASCAoEaWRmdhIAEh4KCmFuZHJvaWRfaWQSEDI4YjJkODllMzBmZDIwNmUSGQoIbGF1bmNoaWQSDTE2MDk1MDAwODI2ODISEwoFYXBwaWQSCjExMTEwMjk5MjYSFAoLYXBwX3ZlcnNpb24SBTEuMS4xEhQKEmFwcF9jbGFzc2lmaWNhdGlvbhILCgdhcHBfdGFnEgASEwoOaXNQa2dEb3dubG9hZWQSATESEAoLaXNYNUVuYWJsZWQSATASDwoKYXBwX3N0YXR1cxIBMxIGCgRwYXRoEhAKBXJlZmVyEgdsdF8xMDAxEhcKCmFjdGlvbnR5cGUSCXBhZ2VfdmlldxIXCg5zdWJfYWN0aW9udHlwZRIFMnNob3cSIQoPcmVzZXJ2ZXNfYWN0aW9uEg5icmluZ190b19mcm9udBIRCglyZXNlcnZlczISBG51bGwSHQoJcmVzZXJ2ZXMzEhBTREtfaGFzWDVfaGFzUGtnEhEKCXJlc2VydmVzNBIEbnVsbBIRCglyZXNlcnZlczUSBG51bGwSEQoJcmVzZXJ2ZXM2EgRudWxsEg0KCGFwcF90eXBlEgEwEiAKC3Nka192ZXJzaW9uEhExLjYuMTFfMThfOTJhNmQwYRIaCg9kZXZpY2VfcGxhdGZvcm0SB2FuZHJvaWQSFgoMZGV2aWNlX21ha2VyEgZIVUFXRUkSGAoMZGV2aWNlX21vZGVsEghWS1ktQUwwMBITCg5kZXZpY2VfdmVyc2lvbhIBORIUCgxuZXR3b3JrX3R5cGUSBHdpZmkSFgoSbmV0d29ya19nYXRld2F5X2lwEgASHQoMbmV0d29ya19zc2lkEg1DaGluYU5ldC1rYVNwEhsKBWdwc194EhIyNi42MTE5NjMyMTI1OTE4MjgSGgoFZ3BzX3kSETEwNi42MzUyODE2NDIyNzA4EhIKCnNvdXJjZV9hcHASBDIwMDESFQoOc291cmNlX3ZlcnNpb24SAzguMRIgChNzb3VyY2VfdWluX3BsYXRmb3JtEglhbm9ueW1vdXMSEAoOY29ubmVjdF9vcGVuaWQSEQoMY29ubmVjdF90eXBlEgEwEgwKCmN1c3RvbUluZm8KugcIDBISCgN1aW4SCzE3NTg1OTIwODY1EgkKBXRvdWluEgASGgoJdGltZXN0YW1wEg0xNjA5NTAwMDgyNzkxEi0KCXFxdmVyc2lvbhIgVjFfQU5EX01JTklTREtfMS41LjNfMF9SRUxFQVNFX0ISBgoEaW1laRIICgRpZGZhEgASCAoEaWRmdhIAEh4KCmFuZHJvaWRfaWQSEDI4YjJkODllMzBmZDIwNmUSGQoIbGF1bmNoaWQSDTE2MDk1MDAwODI2ODISEwoFYXBwaWQSCjExMTEwMjk5MjYSFAoLYXBwX3ZlcnNpb24SBTEuMS4xEhQKEmFwcF9jbGFzc2lmaWNhdGlvbhILCgdhcHBfdGFnEgASEwoOaXNQa2dEb3dubG9hZWQSATESEAoLaXNYNUVuYWJsZWQSATASDwoKYXBwX3N0YXR1cxIBMxIGCgRwYXRoEhAKBXJlZmVyEgdsdF8xMDAxEhcKCmFjdGlvbnR5cGUSCXBhZ2VfdmlldxIXCg5zdWJfYWN0aW9udHlwZRIFMnNob3cSHwoPcmVzZXJ2ZXNfYWN0aW9uEgxjbGlja19yZXN1bWUSEAoJcmVzZXJ2ZXMyEgMxMDYSHQoJcmVzZXJ2ZXMzEhBTREtfaGFzWDVfaGFzUGtnEhEKCXJlc2VydmVzNBIEbnVsbBIRCglyZXNlcnZlczUSBG51bGwSEQoJcmVzZXJ2ZXM2EgRudWxsEg0KCGFwcF90eXBlEgEwEiAKC3Nka192ZXJzaW9uEhExLjYuMTFfMThfOTJhNmQwYRIaCg9kZXZpY2VfcGxhdGZvcm0SB2FuZHJvaWQSFgoMZGV2aWNlX21ha2VyEgZIVUFXRUkSGAoMZGV2aWNlX21vZGVsEghWS1ktQUwwMBITCg5kZXZpY2VfdmVyc2lvbhIBORIUCgxuZXR3b3JrX3R5cGUSBHdpZmkSFgoSbmV0d29ya19nYXRld2F5X2lwEgASHQoMbmV0d29ya19zc2lkEg1DaGluYU5ldC1rYVNwEhsKBWdwc194EhIyNi42MTE5NjMyMTI1OTE4MjgSGgoFZ3BzX3kSETEwNi42MzUyODE2NDIyNzA4EhIKCnNvdXJjZV9hcHASBDIwMDESFQoOc291cmNlX3ZlcnNpb24SAzguMRIgChNzb3VyY2VfdWluX3BsYXRmb3JtEglhbm9ueW1vdXMSEAoOY29ubmVjdF9vcGVuaWQSEQoMY29ubmVjdF90eXBlEgEwEgwKCmN1c3RvbUluZm8qHzE3NTg1OTIwODY1XzAxMDExOTIxMjI3OThfNTAyMzkyGG1pbmlfYXBwX3JlcG9ydF90cmFuc2ZlcjoKRGF0YVJlcG9ydELrAQoLMTc1ODU5MjA4NjUSyAFleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKdGIySnBiR1VpT2lJeE56VTROVGt5TURnMk5TSXNJbkJ5YnlJNklqQTROU0lzSW1OcGRIa2lPaUkzT0RjaUxDSnBaQ0k2SW1RMk5USTVNak0zWm1JNFpUSmtaR015WkdRMlpHUXdNVGhqWkdKbE1UVmpJbjAuN1FEUXVQUEFFOHljMjM0dTRScGxKUXlORWFmVUNCQXdQLWJUQ2ZnQkNxNBoEMjAwMSAAKgkxMDE3OTQzOTRYAA==", 'base64');
        var buf = buf_tpl.slice(0, 0x82)

        // user
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xA7)])

        // time
        let time = new Date().getTime() + ''
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x10F)])

        // android_id
        let android_id = '28b2d89e30fd206e'
        buf_tmp = Buffer.from(android_id)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x12D)])

        // launchid
        launchid = launchid || new Date().getTime() + ''
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x145)])

        // appid
        let appid = game.gameCode
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x160)])

        // version
        let version = '1.1.1'
        buf_tmp = Buffer.from(version)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x208)])

        // action
        //let action = 'click' /close
        buf_tmp = Buffer.from(action)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x439)])

        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x45E)])

        // time
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4C6)])

        // android_id
        buf_tmp = Buffer.from(android_id)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x4E4)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x517)])

        // version
        buf_tmp = Buffer.from(version)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x7F9)])

        // uin
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x81E)])

        // time
        buf_tmp = Buffer.from(time)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x886)])

        // android_id
        buf_tmp = Buffer.from(android_id)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x8A4)])

        // launchid
        buf_tmp = Buffer.from(launchid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x8BC)])

        // appid
        buf_tmp = Buffer.from(appid)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0x8D7)])

        // version
        buf_tmp = Buffer.from(version)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xBAA)])

        // custom
        buf_tmp = Buffer.from(`${options.user}_0101180709792_111872`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xBF4)])

        // user
        buf_tmp = Buffer.from(`${options.user}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xC02)])

        // jwt
        buf_tmp = Buffer.from(`${jwt}`)
        buf = Buffer.concat([buf, buf_tmp, buf_tpl.slice(buf.length + buf_tmp.length, 0xCC9)])

        // fall
        buf = Buffer.concat([buf, buf_tpl.slice(0xCC9 + 1, 0xCDE + 1)])

        let res = await axios.request({
            headers: {
                "user-agent": "okhttp/4.4.0"
            },
            url: `https://q.qq.com/mini/OpenChannel?Action=input&Nonce=844446177&PlatformID=2001&SignatureMethod=HmacSHA256&Timestamp=1609498732&Signature=CarOLq%2FDutf2ftVlQpAK4m57xMALgWEBzPxVlaqBUHE%3D`,
            method: 'post',
            responseType: 'arrayBuffer',
            data: buf
        }, {
            jar: null
        }).catch(err => console.log(err))

        let result = Buffer.from(res.data).toString('base64')
        let pre = Buffer.from([0x08, 0x57]).toString('base64')
        if (result === pre) {
            console.log('reportTransfer成功')
        }

        // await new Promise((resolve, reject) => {
        //     fs.writeFile('./reportTime_bin', buf, function (err) {
        //         if (err) throw err;
        //         resolve();
        //     })
        // })

        return launchid
    },
    UseUserApp: async (axios, options) => {

        const { game, app } = options

        let jwt = undefined
        axios.defaults.headers.cookie.split('; ').forEach(item => {
            if (item.indexOf('jwt') === 0) {
                jwt = item.split("=").pop()
            }
        })

        var buf = new Buffer(0x0);
        buf = Buffer.concat([buf, Buffer.from([0x08, 0x20])])

        let buf_tmp = Buffer.from('V1_AND_MINISDK_1.5.3_0_RELEASE_B')
        buf = Buffer.concat([buf, Buffer.from([0x12, buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x1A])])

        buf_tmp = Buffer.from('m=VKY-AL00&o=9&a=28&p=1080*1920&f=HUAWEI&mm=5725&cf=1800&cc=8&qqversion=8.1')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x22])])

        buf_tmp = Buffer.from(JSON.stringify({ "appId": app.appId, "verType": app.type, "source": 0, "channelInfo": { "refer": "1001", "via": "" } }))
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])


        buf = Buffer.concat([buf, Buffer.from([0x2A, 0x1F])])

        // user
        buf_tmp = Buffer.from(`${options.user}_0101180709792_111872`)
        buf = Buffer.concat([buf, buf_tmp])

        buf_tmp = Buffer.from('mini_app_userapp')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf_tmp = Buffer.from(':')
        buf = Buffer.concat([buf, buf_tmp])

        buf_tmp = Buffer.from('UseUserApp')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x42, 0xEB, 0x01, 0x0A])])

        // user
        buf_tmp = Buffer.from(options.user)
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        // jwt
        buf_tmp = Buffer.from(jwt)
        buf = Buffer.concat([buf, Buffer.from([0x12, buf_tmp.length, 0x01]), buf_tmp])

        buf_tmp = Buffer.from('2001')
        buf = Buffer.concat([buf, Buffer.from([0x1A, buf_tmp.length]), buf_tmp])
        buf = Buffer.concat([buf, Buffer.from([0x20, 0x00, 0x2A])])

        buf_tmp = Buffer.from('101794394')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x58, 0x01])])

        // console.log(buf_tmp.length)
        // console.log(buf)
        // await new Promise((resolve, reject) => {
        //     fs.writeFile('./reportTime_bin', buf, function (err) {
        //         if (err) throw err;
        //         resolve();
        //     })
        // })

        let res = await axios.request({
            headers: {
                "user-agent": "okhttp/4.4.0"
            },
            url: `https://q.qq.com/mini/OpenChannel?Action=input&Nonce=844446177&PlatformID=2001&SignatureMethod=HmacSHA256&Timestamp=1609498732&Signature=CarOLq%2FDutf2ftVlQpAK4m57xMALgWEBzPxVlaqBUHE%3D`,
            method: 'post',
            responseType: 'arrayBuffer',
            data: buf
        }, {
            jar: null
        }).catch(err => console.log(err))
        // \b "\x02{}
        let result = Buffer.from(res.data).toString('base64')
        let pre = Buffer.from([0x08, 0x20, 0x22, 0x02, 0x7B, 0x7D]).toString('base64')
        if (result === pre) {
            console.log('UseUserApp成功')
        }
    },
    gameInfo: async (axios, options) => {
        const { game } = options

        let jwt = undefined
        axios.defaults.headers.cookie.split('; ').forEach(item => {
            if (item.indexOf('jwt') === 0) {
                jwt = item.split("=").pop()
            }
        })

        var buf = new Buffer(0x0);
        buf = Buffer.concat([buf, Buffer.from([0x08, 0x20])])

        let buf_tmp = Buffer.from('V1_AND_MINISDK_1.5.3_0_RELEASE_B')
        buf = Buffer.concat([buf, Buffer.from([0x12, buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x1A])])

        buf_tmp = Buffer.from('m=VKY-AL00&o=9&a=28&p=1080*1920&f=HUAWEI&mm=5725&cf=1800&cc=8&qqversion=8.1')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x22])])

        buf_tmp = Buffer.from(JSON.stringify({ "link": game.url, "linkType": 0 }).replace(/\//g, '\\/'))
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])


        buf = Buffer.concat([buf, Buffer.from([0x2A, 0x1F])])

        // user
        buf_tmp = Buffer.from(`${options.user}_0101180709792_111872`)
        buf = Buffer.concat([buf, buf_tmp])

        buf_tmp = Buffer.from('mini_app_info')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf_tmp = Buffer.from(':')
        buf = Buffer.concat([buf, buf_tmp])

        buf_tmp = Buffer.from('GetAppInfoByLink')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x42, 0xEB, 0x01, 0x0A])])

        // user
        buf_tmp = Buffer.from(options.user)
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        // jwt
        buf_tmp = Buffer.from(jwt)
        buf = Buffer.concat([buf, Buffer.from([0x12, buf_tmp.length, 0x01]), buf_tmp])

        buf_tmp = Buffer.from('2001')
        buf = Buffer.concat([buf, Buffer.from([0x1A, buf_tmp.length]), buf_tmp])
        buf = Buffer.concat([buf, Buffer.from([0x20, 0x00, 0x2A])])

        buf_tmp = Buffer.from('101794394')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x58, 0x01])])

        // console.log(buf_tmp.length)
        // console.log(buf)
        // await new Promise((resolve, reject) => {
        //     fs.writeFile('./reportTime_bin', buf, function (err) {
        //         if (err) throw err;
        //         resolve();
        //     })
        // })

        let res = await axios.request({
            headers: {
                "user-agent": "okhttp/4.4.0"
            },
            url: `https://q.qq.com/mini/OpenChannel?Action=input&Nonce=844446177&PlatformID=2001&SignatureMethod=HmacSHA256&Timestamp=1609498732&Signature=CarOLq%2FDutf2ftVlQpAK4m57xMALgWEBzPxVlaqBUHE%3D`,
            method: 'post',
            responseType: 'arrayBuffer',
            data: buf
        }, {
            jar: null
        }).catch(err => console.log(err))
        let result = JSON.parse(Buffer.from(res.data).slice(0x7).toString('utf-8'))
        return result
    },
    gameReportTime: async (axios, options) => {
        const { game } = options

        let jwt = undefined
        axios.defaults.headers.cookie.split('; ').forEach(item => {
            if (item.indexOf('jwt') === 0) {
                jwt = item.split("=").pop()
            }
        })

        var buf = new Buffer(0x0);
        buf = Buffer.concat([buf, Buffer.from([0x08, 0x20])])

        let buf_tmp = Buffer.from('V1_AND_MINISDK_1.5.3_0_RELEASE_B')
        buf = Buffer.concat([buf, Buffer.from([0x12, buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x1A])])

        buf_tmp = Buffer.from('m=VKY-AL00&o=9&a=28&p=1080*1920&f=HUAWEI&mm=5725&cf=1800&cc=8&qqversion=null')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x22, 0x35, 0x0A, 0x03])])

        buf_tmp = Buffer.from('0')
        buf = Buffer.concat([buf, Buffer.from([0x12, buf_tmp.length]), buf_tmp])

        // gameCode
        buf_tmp = Buffer.from(game.gameCode)
        buf = Buffer.concat([buf, Buffer.from([0x12, buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x18, 0x0B, 0x28, 0xBC, 0x81, 0xBB, 0xFF, 0x05, 0x30, 0x00, 0x38, 0x01, 0x40, 0xE9, 0x07, 0x48, 0x00, 0x52])])

        // time
        buf_tmp = Buffer.from(new Date().getTime() + '')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x5A, 0x00, 0x60, 0x00])])

        buf = Buffer.concat([buf, Buffer.from([0x2A, 0x1F])])
        // user
        buf_tmp = Buffer.from(`${options.user}_0101180709792_111872`)
        buf = Buffer.concat([buf, buf_tmp])

        buf_tmp = Buffer.from('mini_app_growguard')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf_tmp = Buffer.from(':')
        buf = Buffer.concat([buf, buf_tmp])

        buf_tmp = Buffer.from('JudgeTiming')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x42, 0xEB, 0x01, 0x0A])])

        // user
        buf_tmp = Buffer.from(options.user)
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        // jwt
        buf_tmp = Buffer.from(jwt)
        buf = Buffer.concat([buf, Buffer.from([0x12, buf_tmp.length, 0x01]), buf_tmp])

        buf_tmp = Buffer.from('2001')
        buf = Buffer.concat([buf, Buffer.from([0x1A, buf_tmp.length]), buf_tmp])
        buf = Buffer.concat([buf, Buffer.from([0x20, 0x00, 0x2A])])

        buf_tmp = Buffer.from('101794394')
        buf = Buffer.concat([buf, Buffer.from([buf_tmp.length]), buf_tmp])

        buf = Buffer.concat([buf, Buffer.from([0x58, 0x00])])

        let res = await axios.request({
            headers: {
                "user-agent": "okhttp/4.4.0"
            },
            responseType: 'arrayBuffer',
            url: `https://q.qq.com/mini/OpenChannel?Action=input&Nonce=1998875740&PlatformID=2001&SignatureMethod=HmacSHA256&Timestamp=1609494443&Signature=qIw0UGAw5RIJ%2FYR3GSqDjOlnTgbZ1TJ4Ug7duEVEBwU%3D`,
            method: 'post',
            data: buf
        }, {
            jar: null
        }).catch(err => console.log(err))
        let result = Buffer.from(res.data).toString('base64')
        let pre = Buffer.from([0x08, 0x20, 0x22, 0x07, 0x0A, 0x03, 0x12, 0x01, 0x30, 0x18, 0x37]).toString('base64')
        if (result === pre) {
            console.log('上报JudgeTiming数据成功')
        }
    },
    gameFlowGet: async (axios, options) => {
        // TODO 未知游戏时长上报
        const { gameId } = options
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'userNumber': options.user,
            'methodType': 'flowGet',
            'gameId': gameId,
            'deviceType': 'Android',
            'clientVersion': '8.0100',
        }
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `/producGameApp`,
            method: 'post',
            data: transParams(params)
        })
        if (data) {
            console.log(data.msg)
        } else {
            console.log('记录失败')
        }
    }
}