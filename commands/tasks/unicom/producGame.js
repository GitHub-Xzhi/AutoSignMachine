// TODO !!!!! 签名算法暂未知
// 娱乐中心

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
    gameReportTime: async (axios, options) => {
        // TODO 上报时间-似乎通过q.qq.com的渠道~暂无法处理
        const { game } = options
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        // let params = {
        //     "methodType": "1",
        //     "mobile": options.user,
        //     "param": {
        //         "id": game.gameCode,
        //         "title": game.name,
        //         "desc": game.gameDesc,
        //         "dataType": "5",
        //         "images": game.smallImage,
        //         "linkUrl": game.url,
        //         "deviceType": "Android",
        //         "gameType": "Y"
        //     }
        // }
        // console.log(params)
        // let { data } = await axios.request({
        //     baseURL: 'https://m.client.10010.com/',
        //     headers: {
        //         "user-agent": useragent,
        //         "referer": "https://img.client.10010.com",
        //         "origin": "https://img.client.10010.com"
        //     },
        //     url: `/finderInterface/myCircleForEntertainment`,
        //     method: 'post',
        //     data: params
        // })
        // console.log(data)
        let i = 40
        do {
            console.log(i)
            let params = [
                game.gameCode,
                'https://tga-data-upload.hrgame.com.cn/sync_xcx',
                1,
                200,
                82,
                10,
                'tga-data-upload.hrgame.com.cn',
                'https://tga-data-upload.hrgame.com.cn/sync_xcx',
                'wifi',
                '0',
                'android',
                new Date().getTime(),
                'V1_AND_MINISDK_1.5.3_0_RELEASE_B',
                2001,
                'null',
                'anonymous'
            ]
            let { data } = await axios.request({
                baseURL: 'https://q.qq.com/',
                headers: {
                    "user-agent": "okhttp/4.4.0"
                },
                url: `/report/dc/dc05388`,
                method: 'post',
                data: params.join('|')
            })
            await new Promise((resolve, reject) => setTimeout(resolve,15*1000))
        } while (i--)

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