const _request = require('../../../utils/request')
var start = async (params) => {
  const { cookies, options } = params
  if (!cookies || !('htVD_2132_auth' in cookies) || !cookies['htVD_2132_auth']) {
    throw new Error("需要提供htVD_2132_auth参数")
  }

  if (!('htVD_2132_saltkey' in cookies) || !cookies['htVD_2132_saltkey']) {
    throw new Error("需要提供htVD_2132_saltkey参数")
  }

  const request = _request(cookies)
  
  await scheduler.regTask('dailySign', async () => {
    await require('./sign')(request)
  })

}
module.exports = {
  start
}