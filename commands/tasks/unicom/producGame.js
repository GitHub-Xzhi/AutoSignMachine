// 娱乐中心
const CryptoJS = require("crypto-js");
var crypto = require('crypto');
const { default: PQueue } = require('p-queue');
const moment = require('moment');
const path = require('path');
const { buildUnicomUserAgent } = require('../../../utils/util')

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

var deviceInfos = [
    'm=VKY-AL00&o=9&a=28&p=1080*1920&f=HUAWEI&mm=5725&cf=1800&cc=8&qqversion=null',
    'm=SM-G977N&o=7&a=24&p=1080*1920&f=samsung&mm=5725&cf=1800&cc=8&qqversion=null',
    'm=Pixel&o=8&a=27&p=1080*1920&f=google&mm=5725&cf=1800&cc=8&qqversion=null'
]
var deviceInfo = deviceInfos[Math.floor(Math.random() * deviceInfos.length)]

var producGame = {
    // 娱乐中心每日签到-打卡
    gameSignin: (axios, options) => {
        const useragent = buildUnicomUserAgent(options, 'p')
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
                'deviceInfo': deviceInfo,
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
            'deviceInfo': deviceInfo,
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
        const useragent = buildUnicomUserAgent(options, 'p')
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
        const useragent = buildUnicomUserAgent(options, 'p')
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
    queryIntegral: async (axios, options) => {
        const useragent = buildUnicomUserAgent(options, 'p')
        let params = {
            'methodType': 'queryIntegral',
            'taskCenterId': options.taskCenterId,
            'videoIntegral': '0',
            'isVideo': 'Y',
            'clientVersion': '8.0100',
            'deviceType': 'Android'
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
            console.log('获取积分任务状态成功')
        } else {
            console.log('获取积分任务状态失败')
        }
    },
    getTaskList: async (axios, options) => {
        const useragent = buildUnicomUserAgent(options, 'p')
        let params = {
            'methodType': 'queryTaskCenter',
            'deviceType': 'Android',
            'clientVersion': '8.0100'
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
        let queue = new PQueue({ concurrency: 2 });

        console.log('调度任务中', '并发数', 2)
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
                await producGame.timeTaskQuery(axios, options)
                await producGame.gameFlowGet(axios, {
                    ...options,
                    gameId: game.gameId
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

        console.log('调度任务中', '并发数', 2)
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
                await producGame.getTaskList(axios, options)
                await producGame.gameIntegralGet(axios, {
                    ...options,
                    taskCenterId: game.id
                })
            })
        }

        await queue.onIdle()

        await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 10) + 30) * 1000))
        let { games: cgames } = await producGame.getTaskList(axios, options)
        games = cgames.filter(d => d.task === '5' && d.reachState === '1' && d.task_type === 'duration')
        console.log('剩余未领取game', games.length)
        for (let game of games) {
            await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 10) + 20) * 1000))
            await producGame.gameIntegralGet(axios, {
                ...options,
                taskCenterId: game.id
            })
        }

        await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 5) + 5) * 1000))
        let { games: ngames } = await producGame.getTaskList(axios, options)
        let task_times = ngames.find(d => d.task === '3' && d.task_type === 'times')
        if (task_times && task_times.reachState === '1') {
            await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 10) + 15) * 1000))
            await producGame.gameIntegralGet(axios, {
                ...options,
                taskCenterId: task_times.id
            })
        }
    },
    timeTaskQuery: async (axios, options) => {
        const useragent = buildUnicomUserAgent(options, 'p')
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
        const useragent = buildUnicomUserAgent(options, 'p')
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
                "origin": "https://img.client.10010.com",
                "X-Requested-With": "com.sinovatech.unicom.ui"
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
        const useragent = buildUnicomUserAgent(options, 'p')
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
    },
    gameBox: async (axios, options) => {
        let { games: v_games } = await producGame.getTaskList(axios, options)
        let box_task = v_games.find(d => d.id === '98' && d.reachState !== '2')
        if (box_task) {
            await producGame.gameIntegralGet(axios, {
                ...options,
                taskCenterId: box_task.id
            })
        }
    },
    watch3TimesVideoQuery: async (request, options) => {
        let params = {
            'arguments1': 'AC20200728150217', // acid
            'arguments2': 'GGPD', // yhChannel
            'arguments3': '96945964804e42299634340cd2650451', // yhTaskId menuId
            'arguments4': new Date().getTime(), // time
            'arguments6': '',
            'netWay': 'Wifi',
            'version': `android@8.0100`,
        }
        params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
        return await require('./taskcallback').query(request, {
            ...options,
            params
        })
    },
    watch3TimesVideo: async (axios, options) => {
        const { jar } = options
        let params = {
            'arguments1': 'AC20200728150217',
            'arguments2': 'GGPD',
            'arguments3': '96945964804e42299634340cd2650451',
            'arguments4': new Date().getTime(),
            'arguments6': '',
            'arguments7': '',
            'arguments8': '',
            'arguments9': '',
            'netWay': 'Wifi',
            'remark1': '游戏频道看视频得积分',
            'remark': '游戏视频任务积分',
            'version': `android@8.0100`,
            'codeId': 945535736
        }
        params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
        await require('./taskcallback').doTask(axios, {
            ...options,
            params,
            jar
        })
    },
    doTodayDailyTask: async (axios, options) => {

        let { games: v_games } = await producGame.getTaskList(axios, options)
        let video_task = v_games.find(d => d.task_type === 'video')

        if (video_task.reachState === '0') {
            let n = parseInt(video_task.task) - parseInt(video_task.progress)
            console.log('领取视频任务奖励,剩余', n, '次')
            let { jar } = await producGame.watch3TimesVideoQuery(axios, options)
            let i = 1
            while (i <= n) {
                await producGame.watch3TimesVideo(axios, {
                    ...options,
                    jar
                })
                await new Promise((resolve, reject) => setTimeout(resolve, (Math.floor(Math.random() * 5) + 2) * 200))
                await producGame.getTaskList(axios, options)
                await producGame.queryIntegral(axios, {
                    ...options,
                    taskCenterId: video_task.id
                })
                ++i
            }
        }

        let { games } = await producGame.getTaskList(axios, options)
        let today_task = games.find(d => d.task_type === 'todayTask')
        if (today_task.reachState === '0') {
            throw new Error('部分日常任务未完成，下次再尝试领取完成今日任务流量')
        } else if (today_task.reachState === '1') {
            await producGame.gameIntegralGet(axios, {
                ...options,
                taskCenterId: today_task.id
            })
            console.log('领取完成今日任务流量+200')
        } else if (today_task.reachState === '2') {
            console.log('每日日常任务已完成')
        }
    }
}


module.exports = producGame