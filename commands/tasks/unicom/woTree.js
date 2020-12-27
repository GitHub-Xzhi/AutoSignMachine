module.exports = {
  getStatus: (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
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
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
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
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `
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
}