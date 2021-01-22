const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);

const err = (error) => {
  return Promise.reject(error)
}

var parseCookieString = function (jar, cookies, config) {
  console.log('parseCookieString for', config.url)
  if (Object.prototype.toString.call(cookies) == '[object String]') {
    cookies.split('; ').forEach(cookie => {
      jar.setCookieSync(cookie, new URL(config.url).origin + '/', {})
    })
  }
  return jar
}

module.exports = cookies => {
  const service = axios.create({
    timeout: 60000,
    withCredentials: true
  })
  service.interceptors.request.use(async config => {
    if (!('user-agent' in config.headers)) {
      config.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36'
    }
    let jar = config.jar
    if (!jar) {
      jar = new tough.CookieJar()
    }
    config.jar = parseCookieString(jar, cookies, config)
    return config
  }, err)
  service.interceptors.response.use(async response => {
    return response
  }, err)
  return service;
}