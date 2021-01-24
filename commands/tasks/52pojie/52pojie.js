const _request = require('../../../utils/request')
const { scheduler } = require('../../../utils/scheduler')
var start = async (params) => {
  const { cookies, options } = params

  let init = async (request, savedCookies) => {
    if (!savedCookies) {
      if (!cookies || !('htVD_2132_auth' in cookies) || !cookies['htVD_2132_auth']) {
        throw new Error("需要提供htVD_2132_auth参数")
      }

      if (!('htVD_2132_saltkey' in cookies) || !cookies['htVD_2132_saltkey']) {
        throw new Error("需要提供htVD_2132_saltkey参数")
      }
      return {
        request: _request(cookies)
      }
    } else {
      return {
        request
      }
    }
  }
  let taskOption = {
    init
  }

  await scheduler.regTask('dailySign', async (request) => {
    await require('./sign')(request)
  }, taskOption)

}
module.exports = {
  start
}