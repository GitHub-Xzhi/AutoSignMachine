var crypto = require('crypto');
var transParams = (data) => {
    let params = new URLSearchParams();
    for (let item in data) {
        params.append(item, data['' + item + '']);
    }
    return params;
};

//data 是准备加密的字符串,key是你的密钥

function encryption (data, key) {
    var iv = "";
    var cipherEncoding = 'base64';
    var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);
    return Buffer.concat([cipher.update(data), cipher.final()]).toString(cipherEncoding);
}

//data 是你的准备解密的字符串,key是你的密钥
function decryption (data, key) {
    var iv = "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
    decipher.setAutoPadding(true);
    return Buffer.concat([decipher.update(data, cipherEncoding), decipher.final()]).toString(clearEncoding);
}

function a (str) {
    str = str + str
    return str.substr(8, 16)
}

var taskcallback = {
    // 查询活动状态
    query: async (axios, options) => {
        let { params } = options
        const useragent = `okhttp/4.4.0`

        let { data, config } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": `https://img.client.10010.com/`,
                "origin": "https://img.client.10010.com"
            },
            url: `/taskcallback/taskfilter/query`,
            method: 'POST',
            data: transParams(params)
        })
        if (data.code === '0000') {
            console.log(data.timeflag === '1' ? `今日参加活动已达上限(${data.achieve}/${data.allocation}次)` : `活动可参加(${data.achieve}/${data.allocation}次)`)
            return {
                num: parseInt(data.allocation) - parseInt(data.achieve),
                jar: config.jar
            }
        } else {
            console.log('查询出错', data.desc)
            return false
        }
    },
    reward: async (axios, options) => {
        let { params, jar } = options
        let cookiesJson = jar.toJSON()
        let ecs_token = cookiesJson.cookies.find(i => i.key == 'ecs_token')
        if (!ecs_token) {
            throw new Error('ecs_token缺失')
        }
        ecs_token = ecs_token.value
        let orderId = params.orderId || crypto.createHash('md5').update(new Date().getTime() + '').digest('hex')
        let codeId = parseInt(params.codeId || 945535616)
        let app_id = "5049584"
        let media_extra = [
            ecs_token,
            options.user,
            'android',
            params.arguments1,
            params.arguments2,
            orderId,// orderId
            codeId, //codeId
            params.remark,
            'Wifi'
        ]

        var data = {
            "oversea_version_type": 0,
            "reward_name": `android-${params.remark1 || params.remark}-激励视频`,
            "reward_amount": 1,
            "network": 4,
            // "latitude": 26.611770629882812,
            // "longitude": 106.63581085205078,
            "sdk_version": "3.3.0.3",
            "user_agent": "Mozilla\/5.0 (Linux; Android 9; VKY-AL00 Build\/HUAWEIVKY-AL00; wv) AppleWebKit\/537.36 (KHTML, like Gecko) Version\/4.0 Chrome\/86.0.4240.198 Mobile Safari\/537.36",
            "extra": {
                // "ad_slot_type": 7,
                // "oaid": "ebdde3b9-def7-6cc3-fdfe-9bfff7ce4126",
                // "language": "golang",
                // "ug_creative_id": "",
                // "ad_id": 1687489184287789,
                // "creative_id": 1687493310795863,
                // "convert_id": 1682419505842179,
                // "uid": 95981094553,
                // "ad_type": 1,
                // "pricing": 9,
                // "ut": 12,
                // "version_code": "8.1",
                // "device_id": 50137151117,
                // "width": 360,
                // "height": 640,
                // "mac": "10:44:00:73:74:BF",
                // "uuid": "867442035025655",
                // "uuid_md5": "8a4dac2481580bd94f8c4b17787b74cd",
                // "os": "android",
                // "client_ip": "111.121.67.62",
                // "open_udid": "",
                // "os_type": null,
                // "app_name": "手机营业厅",
                // "device_type": "VKY-AL00",
                // "os_version": "9",
                // "app_id": "5049584",
                // "template_id": 0,
                // "template_rate": 0,
                // "promotion_type": 0,
                // "img_gen_type": 0,
                // "img_md5": "",
                // "source_type": 1,
                // "pack_time": "{pack_time}",
                // "cid": 1687493310795863,
                // "interaction_type": 4,
                // "src_type": "app",
                // "package_name": "com.sinovatech.unicom.ui",
                // "pos": 5,
                // "landing_type": 3,
                // "is_sdk": true,
                // "is_dsp_ad": false,
                // "imei": "867442035025655",
                // "req_id": "e9da96b1-2d0c-49d0-b5b0-3fd6540d22d4u2997",
                "rit": codeId
            },
            "media_extra": encodeURI(media_extra.join('|')),
            "video_duration": 28.143,
            "play_start_ts": new Date().getTime() - 32 * 1000,
            "play_end_ts": 0,
            "duration": 28143,
            "user_id": app_id,
            "trans_id": crypto.createHash('md5').update(new Date().getTime() + '').digest('hex')
        }

        let key = crypto.createHash('md5').update(new Date().getTime() + '').digest('hex').substr(8, 16)
        let t = JSON.stringify(data).replace(/\//g, "\\\/")//.replace('"{pack_time}"', '1.609770734935479E9')
        let m = encryption(t, a(key)).replace(/(.{76})/g, '$1\n')
        m = '2' + key + m

        var message = {
            message: m,
            cypher: 2
        }
        // let s = a(message.message.substr(1, 16))
        // console.log(decryption(message.message.replace(/\n/g, '').substr(17), s))
        // process.exit(0)

        const useragent = `VADNetAgent/0`
        let res = await axios.request({
            headers: {
                "user-agent": useragent,
                "Content-Type": "application/json; charset=utf-8"
            },
            url: `https://api-access.pangolin-sdk-toutiao.com/api/ad/union/sdk/reward_video/reward/`,
            method: 'POST',
            data: message
        })
        data = res.data
        // s = a(data.message.substr(1, 16))
        // console.log(decryption(data.message.replace(/\n/g, '').substr(17), s))
        if ('code' in data) {
            throw new Error('获取激励信息出错')
        }

        return {
            orderId
        }

    },
    // 提交任务
    doTask: async (axios, options) => {
        let result = await taskcallback.reward(axios, options)
        let params = options.params
        params['orderId'] = result['orderId']
        delete params.codeId
        const useragent = `okhttp/4.4.0`
        let { data } = await axios.request({
            baseURL: 'https://m.client.10010.com/',
            headers: {
                "user-agent": useragent,
                "referer": `https://img.client.10010.com/`,
                "origin": "https://img.client.10010.com"
            },
            url: `/taskcallback/taskfilter/dotasks`,
            method: 'POST',
            data: transParams(params)
        })
        if (data.code === '0000') {
            console.log('提交任务成功', data.prizeName + '+' + data.prizeCount)
        } else {
            console.log('提交任务出错', data.desc)
        }
    },
}
module.exports = taskcallback