const unicom_version = '8.0100'

// TODO !!!!! 签名算法暂未知

// 浏览视频领积分

// 积分活动相关业务参数
let account = {
    yhTaskId: "6c54032f662c4d2bb576872ed408232c",
    yhChannel: "GGPD",
    accountChannel: "517050707",
    accountUserName: "517050707",
    accountPassword: "123456",
    accountToken: "4640b530b3f7481bb5821c6871854ce5",
}

var taskcallback = {
    // 查询活动状态
    query: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
        let params = {

            'arguments6': account.accountChannel,
            'sign': '7d0066a8abc0c53a7960e442bada69b5',
            'netWay': 'Wifi',
            'arguments1': 'AC20200814162815', // acId
            'arguments4': new Date().getTime(), // time
            'version': `android@${unicom_version}`,
            'arguments2': account.yhChannel, // yhChannel
            'arguments3': account.yhTaskId, // yhTaskId menuId
        }
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": `https://img.client.10010.com/`,
                "origin": "https://img.client.10010.com"
            },
            url: `/taskcallback/taskfilter/query`,
            method: 'POST',
            data: params
        })
        if (data.code === '0000') {
            console.log(data.timeflag === 1 ? '今日参加活动已达上限，观看将不赠送积分' : '活动可参加')
            return data.timeflag
        } else {
            console.log('查询出错', data.desc)
            return false
        }
    },
    // 查询活动状态
    doTask: async (axios, options) => {
        const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `

        let params = {
            'arguments8': account.accountPassword,
            'arguments9': account.accountToken,
            'arguments6': account.accountChannel,
            'arguments7': account.accountUserName,
            'orderId': '5d1785a6d190552a4986a216259a0df9',
            'sign': '6534c90339bd19f6b9089bfd72cf5b7d',
            'netWay': 'Wifi',
            'remark': '手厅浏览有礼发积分',
            'version': `android@${unicom_version}`,
            'arguments1': 'AC20200814162815',
            'arguments4': new Date().getTime(), // time
            'arguments2': account.yhChannel, // yhChannel
            'arguments3': account.yhTaskId, // yhTaskId menuId
        }
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": `https://img.client.10010.com/`,
                "origin": "https://img.client.10010.com"
            },
            url: `/taskcallback/taskfilter/dotasks`,
            method: 'POST',
            data: params
        })
        if (data.code === '0000') {
            console.log('参与成功')
        } else {
            console.log('参与出错', data.desc)
        }
    },
}
module.exports = taskcallback