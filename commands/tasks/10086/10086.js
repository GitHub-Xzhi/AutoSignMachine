const { scheduler } = require('../../../utils/scheduler')
const { getCookies, saveCookies } = require('../../../utils/util')
const _request = require('../../../utils/request')

var start = async (params) => {
    const { cookies, options } = params

    let init = async (request, savedCookies) => {
        if (!savedCookies) {
            await saveCookies('10086_' + (options.user || 'default'), cookies)
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


    // 每日签到领取和微币
    await scheduler.regTask('taskCenterWxSign', async (request) => {
        await require('./taskCenter').doWxSignTask(request, options)
    }, taskOption)


}
module.exports = {
    start
}