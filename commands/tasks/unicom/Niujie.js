var transParams = (data) => {
    let params = new URLSearchParams();
    for (let item in data) {
        params.append(item, data['' + item + '']);
    }
    return params;
};

var Niujie = {
    // 转盘抽奖3次-1000牛气抽1次
    CalfLottery: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let n = 3
        do {
            console.log('第', n, '次')
            let { data } = await axios.request({
                headers: {
                    "user-agent": useragent,
                    "referer": "https://img.client.10010.com/2021springfestival/index.html",
                    "origin": "https://img.client.10010.com"
                },
                url: `https://m.client.10010.com/Niujie/calf/CalfLottery`,
                method: 'POST'
            })
            console.log(data)
            await new Promise((resolve, reject) => setTimeout(resolve, 1500))
        } while (--n)
    },
    // 牛气如意-秒杀抢兑
    spikePrize: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let prizes = [
            {
                name: 'vivos7',
                prizeId: '21013015030315978'
            },
            {
                name: '8折充值券',
                prizeId: '21013123452511221'
            },
            {
                name: '10G流量日包',
                prizeId: '21013015071318307'
            },
            {
                name: '腾讯视频会员',
                prizeId: '21012919443117040'
            }
        ]
        for (let prize of prizes) {
            console.log('尝试抢兑', prize.name)
            let { data } = await axios.request({
                headers: {
                    "user-agent": useragent,
                    "referer": "https://img.client.10010.com/2021springfestival/index.html",
                    "origin": "https://img.client.10010.com"
                },
                url: `https://m.client.10010.com/Niujie/imazamox/spikePrize`,
                method: 'POST',
                data: transParams({
                    'prizeId': prize.prizeId
                })
            })
            console.log(data)
        }

    },
    doTask: async (axios, options) => {
        await Niujie.CalfLottery(axios, options)
    }
}

module.exports = Niujie