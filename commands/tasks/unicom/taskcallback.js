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
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);

    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));

    return cipherChunks.join('');
}

//data 是你的准备解密的字符串,key是你的密钥
function decryption (data, key) {
    var iv = "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
    decipher.setAutoPadding(true);

    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));

    return cipherChunks.join('');
}
var taskcallback = {
    // 查询活动状态
    query: async (axios, options) => {
        let { params } = options
        const useragent = `okhttp/4.4.0`
        let { data } = await axios.request({
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
            return parseInt(data.allocation) - parseInt(data.achieve)
        } else {
            console.log('查询出错', data.desc)
            return false
        }
    },
    // 提交任务
    doTask: async (axios, options) => {
        let { params } = options
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
        console.log(data)
        if (data.code === '0000') {
            console.log('提交任务成功')
        } else {
            console.log('提交任务出错', data.desc)
        }
    },
}
module.exports = taskcallback