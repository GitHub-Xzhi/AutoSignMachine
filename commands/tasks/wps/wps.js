const { scheduler } = require('../../../utils/scheduler')
const _request = require('../../../utils/request')

var start = async (params) => {
    const { cookies, options } = params

    let init = async (request, savedCookies) => {
        if (!savedCookies) {
            if (!cookies || !('wps_sid' in cookies) || !cookies['wps_sid']) {
                throw new Error("需要提供wps_sid参数")
            }
            if (!('csrf' in cookies) || !cookies['csrf']) {
                throw new Error("需要提供csrf参数")
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

    await scheduler.regTask('wps_clock_in', async (request) => {
        await require('./clock_in').doTask(request, options)
    }, {
        startHours: 6,
        endHours: 8,
        ...taskOption
    })

}
module.exports = {
    start
}