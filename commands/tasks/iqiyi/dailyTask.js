var crypto = require('crypto');

function w() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
        , t = [];
    return Object.keys(e).forEach((function (a) {
        t.push("".concat(a, "=").concat(e[a]))
    }
    )),
        t.join("&")
}

var task = {
    getTasks: async (axios) => {
        console.log('查询每日任务列表')
        let P00001 = undefined
        axios.defaults.headers.Cookie.split('; ').forEach(item => {
            if (item.indexOf('P00001') === 0) {
                P00001 = item.split("=").pop()
            }
        })
        let { data } = await axios.request({
            headers: {
                "referer": "https://www.iqiyi.com",
                "origin": "https://www.iqiyi.com"
            },
            url: `https://tc.vip.iqiyi.com/taskCenter/task/queryUserTask`,
            method: 'get',
            params: {
                P00001: P00001
            }
        })
        if (data.code === 'A00000') {
            console.log('获取成功')
            return data.data
        } else {
            console.log(data.msg)
        }
    },
    getTaskStatus: async (axios, taskIds) => {
        console.log('查询每日任务状态')
        let P00001 = undefined
        axios.defaults.headers.Cookie.split('; ').forEach(item => {
            if (item.indexOf('P00001') === 0) {
                P00001 = item.split("=").pop()
            }
        })
        var a = taskIds
            , i = a.join(",")
            , n = crypto.createHash("md5").update((new Date).getTime() + Math.floor(999999999 * Math.random()) + '', "utf8").digest("hex")
            , r = {
                appname: "PCW",
                messageId: n,
                version: "2.0",
                invokeType: 'outer_https',
                lang: "zh_cn",
                P00001: P00001,
                taskCode: i,
                newH5: "1",
                fv: "bed99b2cf5722bfe"
            };
        let { data } = await axios.request({
            headers: {
                "referer": "https://www.iqiyi.com",
                "origin": "https://www.iqiyi.com"
            },
            url: `https://tc.vip.iqiyi.com/taskCenter/task/getTaskStatus`,
            method: 'get',
            params: r
        })
        if (data.code === 'A00000') {
            console.log('获取成功')
            return data.data
        } else {
            console.log(data.msg)
        }
    },
    joinTasks: async (axios, tasks) => {
        console.log('开始参与任务')
        let P00001 = undefined
        axios.defaults.headers.Cookie.split('; ').forEach(item => {
            if (item.indexOf('P00001') === 0) {
                P00001 = item.split("=").pop()
            }
        })
        let params = {
            'P00001': P00001,
            'taskCode': 'b6e688905d4e7184',
            'platform': 'b6c13e26323c537d',
            'lang': 'zh_CN',
            'app_lm': 'cn'
        }
        for (let task of tasks) {
            params['taskCode'] = task.taskCode
            let { data } = await axios.request({
                headers: {
                    "referer": "https://www.iqiyi.com",
                    "origin": "https://www.iqiyi.com"
                },
                url: `https://tc.vip.iqiyi.com/taskCenter/task/joinTask`,
                method: 'get',
                params: params
            })
            if (data.code === 'A00000') {
                console.log(`参与任务[${task.taskTitle}]：`, '成功')
            } else {
                console.log(`参与任务[${task.taskTitle}]：`, data.msg)
            }
        }
    },
    getTaskReward: async (axios, taskn, a) => {
        let { data } = await axios.request({
            headers: {
                "referer": "https://www.iqiyi.com",
                "origin": "https://www.iqiyi.com"
            },
            url: "".concat("https://tc.vip.iqiyi.com/taskCenter/task/getTaskRewards", "?").concat(w(a)),
            method: 'post'
        })
        if (data.code === 'A00000') {
            console.log(`完成任务[${taskn.taskCode}, ${taskn.taskTitle}]：`, '成功')
            data.dataNew.length ? console.log(data.dataNew.map(i => i.name + i.value).join(',')) : ''
        } else if ("Q00700" === data.code) {
            console.log(`Q00700：跳过任务[${taskn.taskCode}, ${taskn.taskTitle}]：`)
            // await task.getTaskReward(axios, taskn, {
            //     ...a,
            //     token: data.data.token
            // })
        } else {
            console.log(`完成任务[${taskn.taskCode}, ${taskn.taskTitle}]：`, data.msg)
        }
    },
    completeTasks: async (axios, tasks) => {
        console.log('开始完成任务')
        let P00001 = undefined
        let QC005 = undefined
        let dfp = undefined
        axios.defaults.headers.Cookie.split('; ').forEach(item => {
            if (item.indexOf('P00001') === 0) {
                P00001 = item.split("=").pop()
            }
            if (item.indexOf('QC005') === 0) {
                QC005 = item.split("=").pop()
            }
            if (item.indexOf('_dfp') === 0) {
                dfp = item.split("=").pop().split("@")[0]
            }
        })
        var a = {
            P00001: P00001,
            taskCode: 'b6e688905d4e7184',
            dfp: dfp,
            platform: 'b6c13e26323c537d',
            lang: 'zh_CN',
            app_lm: 'cn',
            deviceID: QC005,
            token: '',
            multiReward: 1,
            fv: 'bed99b2cf5722bfe'
        }
        for (let taskn of tasks) {
            a['taskCode'] = taskn.taskCode
            await task.getTaskReward(axios, taskn, a)
        }
    }
}

module.exports = task