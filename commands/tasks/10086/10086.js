const { scheduler } = require('../../../utils/scheduler')
const { getCookies, saveCookies } = require('../../../utils/util')
const _request = require('../../../utils/request')

var start = async (params) => {
    const { cookies, options } = params

    let savedCookies = await getCookies('10086_' + options.user)
    if (!savedCookies) {
        savedCookies = cookies
    }
    const request = _request(savedCookies, true)

    // 每日签到领取和微币
    await scheduler.regTask('taskCenterWxSign', async () => {
        await require('./taskCenter').doWxSignTask(request, options)
    })


}
module.exports = {
    start
}