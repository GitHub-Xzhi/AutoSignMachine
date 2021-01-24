// 娱乐中心
const CryptoJS = require("crypto-js");
const { default: PQueue } = require('p-queue');
const moment = require('moment');
const path = require('path');

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


var producGame = {
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

    playGame: async (axios, options) => {
        const { game, launchid, jar } = options

        let cookiesJson = jar.toJSON()
        let jwt = cookiesJson.cookies.find(i => i.key == 'jwt')
        if (!jwt) {
            throw new Error('jwt缺失')
        }
        jwt = jwt.value

        let playGame = require(path.resolve(path.join(__dirname, './playGame.json')));
        let protobufRoot = require('protobufjs').Root;
        let root = protobufRoot.fromJSON(playGame);
        let mc = root.lookupType('JudgeTimingBusiBuff');
        let launchId1 = launchid || new Date().getTime() + ''

        let n = 1;

        do {
            console.log('第', n, '次')
            let dd = moment().format('MMDDHHmmss')
            let time = new Date().getTime() % 1000
            let s = Math.floor(Math.random() * 90000) + 10000
            let traceid = `${options.user}_${dd}${time}_${s}`
            let Seq = n * 3

            let a = {
                'uin': `${options.user}`,
                'sig': jwt,
                'platform': '2001',
                'type': 0,
                'appid': '101794394'
            }
            let busiBuff = {
                extInfo: null,
                appid: game.gameCode,
                factType: n == 6 ? 13 : 12,
                duration: null,
                reportTime: Math.floor(new Date().getTime() / 1000) + n * 62,
                afterCertify: 0,
                appType: 1,
                scene: 1001,
                totalTime: n * 62,
                launchId: launchId1,
                via: '',
                AdsTotalTime: 0,
                hostExtInfo: null
            }
            let c = {
                'Seq': Seq,
                'qua': 'V1_AND_MINISDK_1.5.3_0_RELEASE_B',
                'deviceInfo': 'm=VKY-AL00&o=9&a=28&p=1080*1920&f=HUAWEI&mm=5725&cf=1800&cc=8&qqversion=null',
                'busiBuff': busiBuff,
                'traceid': traceid,
                'Module': `mini_app_growguard`,
                'Cmdname': 'JudgeTiming',
                'loginSig': a,
                'Crypto': null,
                'Extinfo': null,
                'contentType': 0
            }

            let infoEncodeMessage = mc.encode(mc.create(c)).finish();

            let Nonce = Math.floor(Math.random() * 90000) + 10000
            let Timestamp = Math.floor(new Date().getTime() / 1000)

            let str = `POST /mini/OpenChannel?Action=input&Nonce=${Nonce}&PlatformID=2001&SignatureMethod=HmacSHA256&Timestamp=${Timestamp}`
            let Signature = CryptoJS.HmacSHA256(str, 'test')
            let hashInBase64 = CryptoJS.enc.Base64.stringify(Signature);

            let res = await axios.request({
                headers: {
                    "user-agent": "okhttp/4.4.0"
                },
                jar: null,
                url: `https://q.qq.com/mini/OpenChannel?Action=input&Nonce=${Nonce}&PlatformID=2001&SignatureMethod=HmacSHA256&Timestamp=${Timestamp}&Signature=${hashInBase64}`,
                method: 'post',
                responseType: 'arrayBuffer',
                data: infoEncodeMessage
            }).catch(err => console.log(err))

            console.log(Buffer.from(res.data).toString('hex'))

            // 这里不等待1分钟，上面使用 n*62 时长累计来替代，也可正常领取
            await new Promise((resolve, reject) => setTimeout(resolve, 35 * 1000))

            ++n
        } while (n <= 6)
    },
    gameInfo: async (axios, options) => {
        const { game, jar } = options

        let cookiesJson = jar.toJSON()
        let jwt = cookiesJson.cookies.find(i => i.key == 'jwt')
        if (!jwt) {
            throw new Error('jwt缺失')
        }
        jwt = jwt.value

        let playGame = require(path.resolve(path.join(__dirname, './playGame.json')));
        let protobufRoot = require('protobufjs').Root;
        let root = protobufRoot.fromJSON(playGame);
        let mc = root.lookupType('GetAppInfoByLinkBusiBuff');

        let n = 1;

        let dd = moment().format('MMDDHHmmss')
        let time = new Date().getTime() % 1000
        let s = Math.floor(Math.random() * 90000) + 10000
        let traceid = `${options.user}_${dd}${time}_${s}`
        let Seq = n * 3

        let a = {
            'uin': `${options.user}`,
            'sig': jwt,
            'platform': '2001',
            'type': 0,
            'appid': '101794394'
        }
        let busiBuff = {
            link: game.url,
            linkType: 0
        }
        let c = {
            'Seq': Seq,
            'qua': 'V1_AND_MINISDK_1.5.3_0_RELEASE_B',
            'deviceInfo': 'm=VKY-AL00&o=9&a=28&p=1080*1920&f=HUAWEI&mm=5725&cf=1800&cc=8&qqversion=null',
            'busiBuff': Buffer.from(JSON.stringify(busiBuff)),
            'traceid': traceid,
            'Module': `mini_app_info`,
            'Cmdname': 'GetAppInfoByLink',
            'loginSig': a,
            'Crypto': null,
            'Extinfo': null,
            'contentType': 1
        }

        let infoEncodeMessage = mc.encode(mc.create(c)).finish();

        let Nonce = Math.floor(Math.random() * 90000) + 10000
        let Timestamp = Math.floor(new Date().getTime() / 1000)

        let str = `POST /mini/OpenChannel?Action=input&Nonce=${Nonce}&PlatformID=2001&SignatureMethod=HmacSHA256&Timestamp=${Timestamp}`
        let Signature = CryptoJS.HmacSHA256(str, 'test')
        let hashInBase64 = CryptoJS.enc.Base64.stringify(Signature);

        let res = await axios.request({
            headers: {
                "user-agent": "okhttp/4.4.0"
            },
            jar: null,
            url: `https://q.qq.com/mini/OpenChannel?Action=input&Nonce=${Nonce}&PlatformID=2001&SignatureMethod=HmacSHA256&Timestamp=${Timestamp}&Signature=${hashInBase64}`,
            method: 'post',
            responseType: 'arrayBuffer',
            data: infoEncodeMessage
        }).catch(err => console.log(err))
        let result = JSON.parse(Buffer.from(res.data).slice(0x7).toString('utf-8'))
        return result
    },
    popularGames: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'methodType': 'popularGames',
            'deviceType': 'Android',
            'clientVersion': '8.0100',
        }
        let { data, config } = await axios.request({
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
            return {
                jar: config.jar,
                popularList: data.popularList || []
            }
        } else {
            console.log('记录失败')
        }
    },
    gameverify: async (axios, options) => {
        const { jar } = options
        let cookiesJson = jar.toJSON()
        let jwt = cookiesJson.cookies.find(i => i.key == 'jwt')
        if (!jwt) {
            throw new Error('jwt缺失')
        }
        jwt = jwt.value

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
    gamerecord: async (axios, options) => {
        const { gameId } = options
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'methodType': 'record',
            'deviceType': 'Android',
            'clientVersion': '8.0100',
            'gameId': gameId,
            'taskId': ''
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `https://m.client.10010.com/producGameApp`,
            method: 'post',
            data: transParams(params)
        })
        if (data) {
            console.log(data.msg)
        } else {
            console.log('记录失败')
        }
    },
    getTaskList: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'methodType': 'queryTaskCenter',
            'deviceType': 'Android',
            'clientVersion': '8.0100',
        }
        let { data, config } = await axios.request({
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `https://m.client.10010.com/producGameTaskCenter`,
            method: 'post',
            data: transParams(params)
        })
        if (data.code === '0000') {
            // reachState 0未完成, 1未领取, 2已完成
            return {
                jar: config.jar,
                games: data.data
            }
        } else {
            console.log('获取游戏任务失败')
            return {}
        }
    },
    doGameFlowTask: async (axios, options) => {
        let { popularList: allgames, jar } = await producGame.popularGames(axios, options)
        let games = await producGame.timeTaskQuery(axios, options)
        games = allgames.filter(g => games.filter(g => g.state === '0').map(i => i.gameId).indexOf(g.id) !== -1)
        console.log('剩余未完成game', games.length)
        let queue = new PQueue({ concurrency: 3 });

        for (let game of games) {
            queue.add(async () => {
                console.log(game.name)
                await producGame.gameverify(axios, {
                    ...options,
                    jar,
                    game
                })
                await producGame.playGame(axios, {
                    ...options,
                    jar,
                    game
                })
            })
        }

        await queue.onIdle()

        await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 10) + 30) * 1000))
        games = await producGame.timeTaskQuery(axios, options)
        games = games.filter(g => g.state === '1')
        console.log('剩余未领取game', games.length)
        for (let game of games) {
            await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 10) + 15) * 1000))
            await producGame.gameFlowGet(axios, {
                ...options,
                gameId: game.gameId
            })
        }
    },
    doGameIntegralTask: async (axios, options) => {
        let { games, jar } = await producGame.getTaskList(axios, options)
        games = games.filter(d => d.task === '5' && d.reachState === '0' && d.task_type === 'duration')
        console.log('剩余未完成game', games.length)
        let queue = new PQueue({ concurrency: 2 });
        for (let game of games) {
            queue.add(async () => {
                console.log(game.name)
                await producGame.gameverify(axios, {
                    ...options,
                    jar,
                    game
                })
                await producGame.gamerecord(axios, {
                    ...options,
                    gameId: game.game_id
                })
                await producGame.playGame(axios, {
                    ...options,
                    jar,
                    game: {
                        ...game,
                        gameCode: game.resource_id
                    }
                })

            })
        }

        await queue.onIdle()

        await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 10) + 30) * 1000))
        let { games: cgames } = await producGame.getTaskList(axios, options)
        games = cgames.filter(d => d.task === '5' && d.reachState === '1' && d.task_type === 'duration')
        console.log('剩余未领取game', games.length)
        for (let game of games) {
            await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 10) + 15) * 1000))
            await producGame.gameIntegralGet(axios, {
                ...options,
                taskCenterId: game.id
            })
        }

        await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 10) + 15) * 1000))
        await producGame.gameIntegralGet(axios, {
            ...options,
            taskCenterId: 148
        })
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
            return data.data//0未进行 state=1待领取 state=2已完成
        } else {
            console.log('记录失败')
        }
    },
    gameFlowGet: async (axios, options) => {
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
            if (data.msg.indexOf('防刷策略接口校验不通过') !== -1) {
                throw new Error('出现【防刷策略接口校验不通过】, 取消本次执行')
            }
        } else {
            console.log('获取奖励失败')
        }
    },
    gameIntegralGet: async (axios, options) => {
        const { taskCenterId } = options
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {
            'methodType': 'taskGetReward',
            'taskCenterId': taskCenterId,
            'deviceType': 'Android',
            'clientVersion': '8.0100',
        }
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com",
                "origin": "https://img.client.10010.com"
            },
            url: `https://m.client.10010.com/producGameTaskCenter`,
            method: 'post',
            data: transParams(params)
        })
        if (data) {
            console.log(data.msg)
            if (data.msg.indexOf('防刷策略接口校验不通过') !== -1) {
                throw new Error('出现【防刷策略接口校验不通过】, 取消本次执行')
            }
        } else {
            console.log('获取奖励失败')
        }
    }
}


module.exports = producGame