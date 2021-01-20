const { scheduler } = require('../../../utils/scheduler')
const { getCookies, saveCookies } = require('../../../utils/util')
const _request = require('../../../utils/request')

var start = async (params) => {
    const { cookies, options } = params

    if (!cookies || !('wps_sid' in cookies) || !cookies['wps_sid']) {
        throw new Error("需要提供wps_sid参数")
    }

    if (!('csrf' in cookies) || !cookies['csrf']) {
        throw new Error("需要提供csrf参数")
    }

    let savedCookies = await getCookies('wps_' + options.wps_sid)
    if (!savedCookies) {
        savedCookies = cookies
    }
    const request = _request(savedCookies, true)

    await scheduler.regTask('wps_clock_in', async () => {
        await require('./clock_in').doTask(request, options)
    }, {
        startHours: 8,
        endHours: 9
    })

}
module.exports = {
    start
}