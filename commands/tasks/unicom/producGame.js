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
    // }
}