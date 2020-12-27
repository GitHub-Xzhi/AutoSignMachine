const axios = require('axios');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);

const err = (error) => {
  return Promise.reject(error)
}
var parseCookie = function (cookies) {
  let cookie = ''
  if (Object.prototype.toString.call(cookies) == '[object String]') {
    cookie = cookies
  } else if (Object.prototype.toString.call(cookies) == '[object Object]') {
    Object.keys(cookies).forEach(item => {
      cookie += item + '=' + cookies[item] + '; '
    })
  }
  return cookie
}
module.exports = (cookies, useJar) => {
  const service = axios.create({
    timeout: 6000,
    headers: {
      cookie: parseCookie(cookies)
    },
    jar: useJar ? new tough.CookieJar() : null,
    withCredentials: true
  })
  service.interceptors.request.use(async config => {
    if (!('user-agent' in config.headers)) {
      config.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36'
    }
    return config
  }, err)
  service.interceptors.response.use(async response => {
    return response
  }, err)
  return service;
}