const useragent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36 QBCore/4.0.1316.400 QQBrowser/9.0.2524.400 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2875.116 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat'
var taskCenter = {
    queryWxSign: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "referer": `http://wx.10086.cn/website/spa/main/taskCenter?yx=JH999999999999`,
            },
            url: `http://wx.10086.cn/website/taskCenter/querySign?t=` + new Date().getTime(),
            method: 'get'
        })
        if (data.rtnCode !== '0') {
            console.log('获取签到状态失败', data.rtnMsg)
            return false
        } else {
            console.log('获取签到状态成功', (data.object.isSign ? `今日已签到` : '今日未签到') + `，已签到${data.object.signDays}天`)
        }
        return data.object.isSign
    },
    doWxSign: async (axios, options) => {
        let { data } = await axios.request({
            headers: {
                "user-agent": useragent,
                "referer": `http://wx.10086.cn/website/spa/main/taskCenter?yx=JH999999999999`,
            },
            url: `http://wx.10086.cn/website/taskCenter/sign?t=` + new Date().getTime(),
            method: 'get'
        })
        if (data.rtnCode !== '0') {
            console.log('签到失败', data.rtnMsg)
        } else {
            console.log('签到成功', `已签到${data.object.signDays}天`)
        }
    },
    // 每日签到领取和微币
    doWxSignTask: async (axios, options) => {
        let isSign = await taskCenter.queryWxSign(axios, options)
        if (!isSign) {
            await taskCenter.doWxSign(axios, options)
        }
    }
}
module.exports = taskCenter