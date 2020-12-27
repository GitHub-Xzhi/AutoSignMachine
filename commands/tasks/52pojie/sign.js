const iconv = require('iconv-lite');
const cheerio = require('cheerio')

var loadSign = async (axios, url) => {
  let chunks = [];
  let str = await new Promise((resolve, reject) => {
    axios.request({
      url: url,
      responseType: 'stream'
    }).then(res => {
      res.data.on('data', chunk => {
        chunks.push(chunk);
      });
      res.data.on('end', () => {
        let buffer = Buffer.concat(chunks);
        let str = iconv.decode(buffer, 'gbk');
        resolve(str)
      })
    })
  })
  let $ = cheerio.load(str)
  let msg = $('#messagetext').text()
  return msg
}

module.exports = async (axios) => {
  let msg = await loadSign(axios, 'https://www.52pojie.cn/home.php?mod=task&do=apply&id=2')
  if (msg.indexOf('需要先登录才能继续本操作') !== -1) {
    console.log("需要先登录才能继续本操作,跳过本期任务")
    return
  }
  if (msg.indexOf('本期您已申请过此任务') !== -1) {
    console.log("本期您已申请过此任务,跳过本期任务")
    return
  }
  msg = await loadSign(axios, 'https://www.52pojie.cn/home.php?mod=task&do=draw&id=2')
  console.log("52pojie签到：", msg)
}