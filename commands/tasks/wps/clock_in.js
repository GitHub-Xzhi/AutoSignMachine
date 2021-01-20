// https://zt.wps.cn/2018/clock_in

var isInTime = function (e, t) {
    var n = (new Date).getHours();
    return n >= e && n < t
}
// 打卡领会员-仅自动邀请
var clockIn = {
    doTask: async (axios, options) => {
        // https://zt.wps.cn/2018/clock_in/api/get_data?member=wps
        let { data } = await axios.request({
            url: `https://zt.wps.cn/2018/clock_in`,
            method: 'get'
        }).catch(err => console.log(err))
        let datamodel = data.match(/datamodel\s*=\s(.*?);/)[1]
        datamodel = JSON.parse(datamodel)
        console.log(`当前用户${datamodel.username},打卡奖励倍数${datamodel.times}倍,昨日是否签到${datamodel.is_sign_up_yesterday},今日是否打卡${datamodel.is_clock_in}`)
        if (datamodel.isSignUpYesterday) {
            if (datamodel.is_clock_in) {
                console.log('今日已打卡，跳过')
                return
            } else if (!isInTime(6, 13)) {
                console.log('不在6-13时间段内，跳过')
                return
            }
        } else {
            console.log('昨日未签到，开始报名挑战')
        }

        if (!datamodel.is_sign_up) {
            console.log('今天尚未报名，开始报名')
            let t = (new Date).getTime()
            let { data: sd } = await axios.request({
                url: `https://zt.wps.cn/2018/clock_in/api/sign_up?sid=${datamodel.userinfo.userid}&from=&csource=&_t=${t}&_=${t}`,
                method: 'get'
            }).catch(err => console.log(err))
            if (sd.result === 'error') {
                console.log('需要绑定相关信息，请访问【https://zt.wps.cn/2018/clock_in】绑定相关信息后在操作，跳过')
                return
            }
        } else {
            console.log('今天已报名')
        }
        console.log('开始邀请人员参与挑战')

        let invite_sid = [
            'V02S2UBSfNlvEprMOn70qP3jHPDqiZU00a7ef4a800341c7c3b',
            'V02StVuaNcoKrZ3BuvJQ1FcFS_xnG2k00af250d4002664c02f',
            'V02SWIvKWYijG6Rggo4m0xvDKj1m7ew00a8e26d3002508b828',
            'V02Sr3nJ9IicoHWfeyQLiXgvrRpje6E00a240b890023270f97',
            'V02SBsNOf4sJZNFo4jOHdgHg7-2Tn1s00a338776000b669579',
            'V02S2oI49T-Jp0_zJKZ5U38dIUSIl8Q00aa679530026780e96',
            'V02ShotJqqiWyubCX0VWTlcbgcHqtSQ00a45564e002678124c',
            'V02SFiqdXRGnH5oAV2FmDDulZyGDL3M00a61660c0026781be1',
            'V02S7tldy5ltYcikCzJ8PJQDSy_ElEs00a327c3c0026782526',
            'V02SPoOluAnWda0dTBYTXpdetS97tyI00a16135e002684bb5c',
            'V02Sb8gxW2inr6IDYrdHK_ywJnayd6s00ab7472b0026849b17',
            'V02SwV15KQ_8n6brU98_2kLnnFUDUOw00adf3fda0026934a7f',
            'V02SC1mOHS0RiUBxeoA8NTliH2h2NGc00a803c35002693584d'
        ]
        for (let sid of invite_sid) {
            try {
                let res = await axios.request({
                    headers: { "sid": sid },
                    url: `http://zt.wps.cn/2018/clock_in/api/invite`,
                    method: 'post',
                    data: `invite_userid=${datamodel.userinfo.userid}`
                }).catch(err => console.log(err))
                let td = res.data
                if (td.result === 'error') {
                    console.log(`邀请[${sid}]失败`, td.msg)
                } else {
                    console.log(`邀请[${sid}]成功`, td.msg)
                }
                console.log(`延时等待`)
                await new Promise((resolve, reject) => setTimeout(resolve, 500))
            } catch (err) {
                console.log(err)
            }
        }

        // let { data: clock_in } = await axios.request({
        //     headers: { "sid": sid },
        //     url: `http://zt.wps.cn/2018/clock_in/api/clock_in?member=wps`,
        //     method: 'get'
        // }).catch(err => console.log(err))
    }
}
module.exports = clockIn