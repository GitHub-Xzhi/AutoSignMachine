
const { default: PQueue } = require('p-queue');

var transParams = (data) => {
    let params = new URLSearchParams();
    for (let item in data) {
        params.append(item, data['' + item + '']);
    }
    return params;
};


var gameYearBox = {
    games: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let { data, config } = await axios.request({
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com/newyeargame/index.html?channelID=04",
                "origin": "https://img.client.10010.com"
            },
            url: `https://m.client.10010.com/game_year_activity`,
            method: 'POST',
            data: transParams({
                'methodType': 'games',
                'clientVersion': '8.0102',
                'deviceType': 'Android'
            })
        })
        return {
            games: data.data,
            jar: config.jar
        }
    },
    query_box_info: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com/newyeargame/index.html?channelID=04",
                "origin": "https://img.client.10010.com"
            },
            url: `https://m.client.10010.com/game_year_activity`,
            method: 'POST',
            data: transParams({
                'methodType': 'query_box_info',
                'clientVersion': '8.0102',
                'deviceType': 'Android'
            })
        })
        return data.data
    },
    box_get_reward: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "referer": "https://img.client.10010.com/newyeargame/index.html?channelID=04",
                "origin": "https://img.client.10010.com"
            },
            url: `https://m.client.10010.com/game_year_activity`,
            method: 'POST',
            data: transParams({
                'methodType': 'box_get_reward',
                'clientVersion': '8.0102',
                'deviceType': 'Android',
                "boxFlag": options.boxFlag
            })
        })
        if (data.code === '0000') {
            console.log(data.desc, data.data.reward_type, data.data.reward_val)
        } else {
            console.log(data.desc)
        }
    },
    doTask: async (axios, options) => {
        let boxinfo = await gameYearBox.query_box_info(axios, options)
        let boxs = [{
            'name': 'first_box',
            'duration': 10,
            'boxFlag': 1
        }, {
            'name': 'second_box',
            'duration': 20,
            'boxFlag': 2
        }, {
            'name': 'third_box',
            'duration': 30,
            'boxFlag': 3
        }, {
            'name': 'fourth_box',
            'duration': 60,
            'boxFlag': 4
        }]
        for (let box of boxs) {
            if (boxinfo[box.name] === '0') {
                console.log('领取宝箱中，尝试达成宝箱条件')
                let producGame = require('./producGame')
                let { games, jar } = await gameYearBox.games(axios, options)
                let queue = new PQueue({ concurrency: 2 });
                console.log('调度任务中', '并发数', 2)
                let n = Math.floor((box.duration - parseInt(boxinfo.total_duration_num)) / 6) + 1
                console.log('预计再游玩', n * 6, '分钟')
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
                                gameCode: game.game_code
                            }
                        })
                    })
                    --n
                    if (n <= 0) {
                        break
                    }
                }
                await queue.onIdle()
                await gameYearBox.query_box_info(axios, options)
                await gameYearBox.box_get_reward(axios, {
                    ...options,
                    boxFlag: box.boxFlag
                })
            } else if (boxinfo[box.name] === '1') {
                console.log('领取宝箱中')
                await gameYearBox.box_get_reward(axios, {
                    ...options,
                    boxFlag: box.boxFlag
                })
            } else if (boxinfo[box.name] === '2') {
                console.log('已领取，跳过')
            }
        }
    }
}

module.exports = gameYearBox