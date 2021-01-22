const MaxNumberOfDonateCoins = 5
const MaxCoinsForVideo = 2

var GetNeedDonateCoins = async (axios, options) => {
  let alreadyCoins = 0
  let needCoins = 0
  let result = await todayCoins(axios)
  if (result.code === 0) {
    alreadyCoins = result.data / 10
  }
  // 目标投币
  let targetCoins = options.NumberOfCoins > MaxNumberOfDonateCoins
    ? MaxNumberOfDonateCoins
    : options.NumberOfCoins
  console.log("目标投币：", targetCoins)
  if (targetCoins > alreadyCoins) {
    needCoins = targetCoins - alreadyCoins;
  }
  console.log("需要投币：", needCoins)

  result = await todayCoinBalance(axios)
  return {
    alreadyCoins,
    needCoins,
    targetCoins,
    coinBalance: result.data.money
  };
}

var todayCoins = (axios) => {
  return new Promise((resolve, reject) => {
    axios.request({
      headers:{
        origin: 'https://account.bilibili.com',
        referer: 'https://account.bilibili.com/account/home'
      },
      url: `https://api.bilibili.com/x/web-interface/coin/today/exp`,
      method: 'get'
    }).then(res => {
      console.log("今日已获得投币经验: " + res.data.data);
      resolve(res.data)
    }).catch(reject)
  })
}

var todayCoinBalance = (axios) => {
  return new Promise((resolve, reject) => {
    axios.request({
      headers:{
        origin: 'https://account.bilibili.com',
        referer: 'https://account.bilibili.com/account/home'
      },
      url: `https://account.bilibili.com/site/getCoin`,
      method: 'post'
    }).then(res => {
      console.log("当前硬币余额：" + res.data.data.money);
      resolve(res.data)
    }).catch(reject)
  })
}

var fetchVideo = (axios) => {
  return new Promise((resolve, reject) => {
    let rids = [1, 3, 4, 5, 160, 22, 119]
    let days = [1, 3, 7]
    let rid = rids[Math.floor(Math.random() * rids.length)]
    let day = days[Math.floor(Math.random() * days.length)]
    axios.request({
      headers:{
        origin: 'https://account.bilibili.com',
        referer: 'https://account.bilibili.com/account/home'
      },
      url: `https://api.bilibili.com/x/web-interface/ranking/region?rid=${rid}&day=${day}`
    }).then(res => {
      let result = res.data
      if (result.code === 0) {
        resolve(result.data[Math.floor(Math.random() * result.data.length)])
      } else {
        resolve()
      }
    }).catch(reject)
  })
}

var TryGetNotDonatedVideo = async (axios) => {
  let tryCount = 0
  let video = undefined
  do {
    video = await fetchVideo(axios)
    tryCount++;
    if (video) {
      let result = IsDonatedCoinsForVideo(axios, video)
      if (!result) {
        break
      }
    }
    let s = Math.floor(Math.random() * 20)
    console.log('等待%s秒再继续', s)
    await new Promise((resolve, reject) => setTimeout(resolve, s * 1000))
  } while (tryCount <= 10)
  return video
}

var IsDonatedCoinsForVideo = (axios, video) => {
  return new Promise((resolve, reject) => {
    axios.request({
      headers:{
        origin: 'https://account.bilibili.com',
        referer: 'https://account.bilibili.com/account/home'
      },
      url: `https://api.bilibili.com/x/web-interface/archive/coins?aid=${video.aid}`,
      method: 'get'
    }).then(res => {
      if(!res.data.data){
        throw new Error('获取视频投币状态失败')
      }
      resolve(res.data.data.multiply)
    }).catch(reject)
  })
}
var AddCoinForVideo = (axios, video, options) => {
  let { CoinsForVideo, SelectLike } = options
  let bili_jct = undefined
  axios.defaults.headers.Cookie.split('; ').forEach(item => {
    if (item.indexOf('bili_jct') === 0) {
      bili_jct = item.split("=").pop()
    }
  })
  return new Promise((resolve, reject) => {

    // 视频投币
    let targetCoins = CoinsForVideo > MaxCoinsForVideo
      ? MaxCoinsForVideo
      : CoinsForVideo

    let params = {
      'aid': video.aid,
      'multiply': targetCoins,
      'select_like': SelectLike ? 1 : 0,
      'cross_domain': "true",
      'csrf': bili_jct
    }
    axios.request({
      headers: {
        "referer": "https://www.bilibili.com",
        "origin": "https://www.bilibili.com",
        "content-type": "application/x-www-form-urlencoded",
      },
      url: `https://api.bilibili.com/x/web-interface/coin/add`,
      method: 'post',
      params
    }).then(res => {
      resolve(res.data)
    }).catch((rr) => {
      console.log(rr.response)
      reject()
    })
  })
}
var tryAddCoinForVideo = async (axios, options) => {
  let video = await TryGetNotDonatedVideo(axios)
  let result = {}
  if (video) {
    console.log("正在为“%s”投币", video.title)
    result = await AddCoinForVideo(axios, video, options)
  }
  return {
    result,
    video
  }
}

module.exports = async (axios, options) => {
  const { alreadyCoins, targetCoins, needCoins, coinBalance } = await GetNeedDonateCoins(axios, options)
  return new Promise(async (resolve, reject) => {
    if (needCoins <= 0) {
      console.log("随机视频投币：已完成投币任务，今天不需要再投啦");
    } else {
      console.log("还需再投%s枚硬币", needCoins);
      if (coinBalance <= 0) {
        console.log("因硬币余额不足，今日暂不执行投币任务");
      } else {
        //余额小于目标投币数，按余额投
        if (coinBalance < needCoins) {
          needCoins = coinBalance
          console.log("因硬币余额不足，目标投币数调整为: %s", needCoins);
        }
        let successCoins = 0;
        let tryCount = 0;
        while (successCoins < needCoins && tryCount <= 10) {
          let { result, video } = await tryAddCoinForVideo(axios, options)
          if (video) {
            if (result.code !== 0) {
              console.log("为“%s”投币失败，原因：%s", video.title, result.message);
            } else {
              console.log("为“%s”投币成功", video.title);
              successCoins = successCoins + options.CoinsForVideo;
            }
          }
          tryCount++;
          if (tryCount > 10) {
            console.log("尝试投币次数超过10次，投币任务终止");
            break
          }
          let s = Math.floor(Math.random() * 20)
          console.log('等待%s秒再继续', s)
          await new Promise((resolve, reject) => setTimeout(resolve, s * 1000))
        }
        let resultCoinBalance = await todayCoinBalance(axios)
        console.log("投币任务完成，余额为: " + resultCoinBalance.data.money);
      }
    }
    resolve()
  })
}