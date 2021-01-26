var crypto = require('crypto');
const { buildUnicomUserAgent } = require('../../../utils/util')

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

var transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data['' + item + '']);
  }
  return params;
};

var woTree = {
  entry: async (axios, options) => {
    const useragent = buildUnicomUserAgent(options, 'p')
    let searchParams = {}
    let result = await axios.request({
      baseURL: 'https://m.client.10010.com/',
      headers: {
        "user-agent": useragent,
        "referer": `https://img.client.10010.com/`,
        "origin": "https://img.client.10010.com"
      },
      url: `https://m.client.10010.com/mobileService/openPlatform/openPlatLineNew.htm?to_url=https://img.client.10010.com/mactivity/woTree/index.html&duanlianjieabc=qA504`,
      method: 'get',
      transformResponse: (data, headers) => {
        if ('location' in headers) {
          let uu = new URL(headers.location)
          let pp = {}
          for (let p of uu.searchParams) {
            pp[p[0]] = p[1]
          }
          if ('ticket' in pp) {
            searchParams = pp
          }
        }
        return data
      }
    }).catch(err => console.log(err))

    let jar = result.config.jar
    let cookiesJson = jar.toJSON()
    let ecs_token = cookiesJson.cookies.find(i => i.key == 'ecs_token')
    if (!ecs_token) {
      throw new Error('ecs_token缺失')
    }
    ecs_token = ecs_token.value

    return {
      searchParams,
      ecs_token,
      jar
    }
  },
  getStatus: (axios, options) => {
    const useragent = buildUnicomUserAgent(options, 'p')
    return new Promise((resolve, reject) => {
      axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com",
          "origin": "https://img.client.10010.com"
        },
        url: `/mactivity/arbordayJson/index.htm`,
        method: 'post'
      }).then(res => {
        let result = res.data
        if (result.code !== '0000') {
          console.log(result.msg)
        } else {
          resolve(result.data)
        }
      }).catch(reject)
    })
  },
  takeFlow: async (axios, params) => {
    const { options, flowChangeList } = params
    const useragent = buildUnicomUserAgent(options, 'p')
    // type 1 看视频得流量  0 普通任务
    for (let flow of flowChangeList) {
      const { data } = await axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com",
          "origin": "https://img.client.10010.com"
        },
        url: flow.type === '1' ? `/mactivity/flowData/refresh.htm?flowId=${flow.id}` : `/mactivity/flowData/takeFlow.htm?flowId=${flow.id}`,
        method: 'post'
      })
      if (data.code !== '0000') {
        console.log(data.msg)
      } else {
        console.log('领取流量+', flow.countTransFlowStr, 'M成功')
      }
    }
  },
  takePop: async (axios, params) => {
    const { options, popList } = params
    const useragent = buildUnicomUserAgent(options, 'p')
    for (let pop of popList) {
      const { data } = await axios.request({
        baseURL: 'https://m.client.10010.com/',
        headers: {
          "user-agent": useragent,
          "referer": "https://img.client.10010.com",
          "origin": "https://img.client.10010.com"
        },
        url: `/mactivity/arbordayJson/arbor/${pop.id}/${pop.type}/${pop.friendNum}/grow.htm`,
        method: 'post'
      })
      if (data.code !== '0000') {
        console.log(data.msg)
      } else {
        console.log('领取话费+', data.data.addedValue)
      }
    }
  },
  water: async (axios, options) => {
    const { jar } = await woTree.entry(axios, options)
    const useragent = buildUnicomUserAgent(options, 'p')

    const { data } = await axios.request({
      baseURL: 'https://m.client.10010.com/',
      headers: {
        "user-agent": useragent,
        "referer": "https://img.client.10010.com",
        "origin": "https://img.client.10010.com"
      },
      url: `/mactivity/arbordayJson/getChanceByIndex.htm?index=0`,
      method: 'post'
    })

    if (data.code !== '0000') {
      console.log('查询浇水机会失败')
      return
    }

    if (data.data.chance_0 === 0) {
      console.log('暂无浇水机会，跳过')
      return
    }

    let num = 2
    do {
      if (num < 2) {
        console.log('看视频浇水')
        let params = {
          'arguments1': '',
          'arguments2': '',
          'arguments3': '',
          'arguments4': new Date().getTime(),
          'arguments6': '',
          'arguments7': '',
          'arguments8': '',
          'arguments9': '',
          'netWay': 'Wifi',
          'remark1': '沃之树看视频得浇水机会',
          'remark': '',
          'version': `android@8.0100`,
          'codeId': 945535626
        }
        params['sign'] = sign([params.arguments1, params.arguments2, params.arguments3, params.arguments4])
        let result = await require('./taskcallback').reward(axios, {
          ...options,
          params,
          jar
        })
        result = await axios.request({
          headers: {
            "user-agent": useragent,
            "referer": `https://img.client.10010.com/`,
            "origin": "https://img.client.10010.com",
          },
          url: `https://m.client.10010.com/mactivity/arbordayJson/giveGrowChance.htm`,
          method: 'POST',
          data: transParams({
            "{}": ""
          })
        })
        console.log(result.data.msg)
      }
      let res = await axios.request({
        headers: {
          "user-agent": useragent,
          "referer": `https://img.client.10010.com/`,
          "origin": "https://img.client.10010.com",
        },
        url: `https://m.client.10010.com/mactivity/arbordayJson/arbor/3/0/3/grow.htm`,
        method: 'POST',
        data: transParams({
          "{}": ""
        })
      })
      let result = res.data
      if (result.code !== '0000') {
        console.log('浇水失败', result.msg)
      } else {
        if (result.data.addedValue) {
          console.log('浇水成功', '培养值+' + result.data.addedValue)
        } else {
          console.log('浇水操作完成')
        }
      }
    } while (--num)
  },
  doTask: async (request, options) => {
    // 沃之树 浇水
    await woTree.water(request, options)
    let i = 2
    let result
    do {
      // 普通 - 看视频 似乎是分开的两次
      result = await woTree.getStatus(request, options)
      await woTree.takeFlow(request, {
        options,
        flowChangeList: result.flowChangeList
      })
    } while (i--)
    await woTree.takePop(request, {
      options,
      popList: result.popList
    })
  }
}

module.exports = woTree