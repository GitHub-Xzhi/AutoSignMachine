//看书里面的5个视频
//活动入口：主页-小说标签-任意一本小说内页章节中间
var crypto = require("crypto");
var sign = (data) => {
    let str = "integralofficial&";
    let params = [];
    data.forEach((v, i) => {
        if (v) {
            params.push("arguments" + (i + 1) + v);
        }
    });
    return crypto
        .createHash("md5")
        .update(str + params.join("&"))
        .digest("hex");
};
let account = {
    yhTaskId: "5a6dd5106495402d9dcc5e801f3171b3",
    yhChannel: "GGPD",
    accountChannel: "517050707",
    accountUserName: "517050707",
    accountPassword: "a123456",
    accountToken: "4640b530b3f7481bb5821c6871854ce5",
};
var book5video = {
    query: async (request, options) => {
        let params = {
            arguments1: "AC20200521222721", // acid
            arguments2: account.yhChannel, // yhChannel
            arguments3: account.yhTaskId, // yhTaskId menuId
            arguments4: new Date().getTime(), // time
            arguments6: "",
            netWay: "Wifi",
            version: `android@8.0102`,
        };
        params["sign"] = sign([
            params.arguments1,
            params.arguments2,
            params.arguments3,
            params.arguments4,
        ]);
        return await require("./taskcallback").query(request, {
            ...options,
            params,
        });
    },
    doTask: async (request, options) => {
        console.log("🐀 看书看累了看看广告...");
        let {
            num,
            jar
        } = await book5video.query(request, options);
//        console.log(num);

        if (!num) {
            console.log("🐀 看书中广告得积分: 今日已完成");
            return;
        }
        do {
//            console.log("还有", num, "次");
            let params = {
                arguments1: "AC20200521222721", // acid
                arguments2: account.yhChannel, // yhChannel
                arguments3: account.yhTaskId, // yhTaskId menuId
                arguments4: new Date().getTime(), // time
                arguments6: "",
                arguments7: "woyuedu",
                arguments8: "a123456",
                arguments9: "",
                orderId: crypto
                    .createHash("md5")
                    .update(new Date().getTime() + "")
                    .digest("hex"),
                netWay: "Wifi",
                remark: "章节视频得积分",
                version: `android@8.0102`,
                //orderId: "0923fca6d5ffb8ec017fc6b3cbc5c9c0",
            };
            params["sign"] = sign([
                params.arguments1,
                params.arguments2,
                params.arguments3,
                params.arguments4,
            ]);
            await require("./taskcallback").doTask(request, {
                ...options,
                params,
                jar,
            });

            let s = Math.floor(Math.random() * 30);
            console.log("☕ 等待%s秒再继续", s);
            // eslint-disable-next-line no-unused-vars
            await new Promise((resolve, reject) => setTimeout(resolve, s * 1000));
        } while (--num);
    },
};

module.exports = book5video;
