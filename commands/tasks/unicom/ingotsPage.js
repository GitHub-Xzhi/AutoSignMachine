let crypto = require("crypto");
let { encryptPhone, sign } = require("./handlers/PAES.js");
const useragent = require("./handlers/myPhone").useragent;
const gameEvents = require("./handlers/dailyEvent");
let { transParams } = require("./handlers/gameUtils");
const referer =
  "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/yuech-qd/bcow/index.html?jump=sign";
let ingotsPage = {
  doTask: async (axios, options) => {
    console.log("😒 游玩聚宝盆...");
    let cookies = await ingotsPage.getOpenPlatLine(axios, options);
    await ingotsPage.postIndexInfo(axios, options, cookies);
    let result = await ingotsPage.postSign(axios, options, cookies);
    await ingotsPage.signDouble(axios, options, { ...cookies, ...result });
  },
  // eslint-disable-next-line no-unused-vars
  postIndexInfo: async (axios, options, { ecs_token, searchParams, jar1 }) => {
    let phone = encryptPhone(options.user, "gb6YCccUvth75Tm2");
    let result = await axios.request({
      headers: {
        "user-agent": useragent(options),
        referer: `https://wxapp.msmds.cn/`,
        origin: "https://wxapp.msmds.cn",
      },
      url: `https://wxapp.msmds.cn/jplus/h5/greetGoldIngot/IndexInfo`,
      method: "POST",
      data: transParams({
        channelId: "LT_channel",
        phone: phone,
        token: ecs_token,
        sourceCode: "lt_ingots",
      }),
    });
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    next(result.data.data);
    function next(data) {
      console.log(
        "😒 聚宝盆状态: " + (data["sign"] ? "已签到" : "未签到"),
        "签到次数: " + data["signTimes"]
      );
      console.log(
        "😒 聚宝盆游玩次数:" + data["leftTimes"],
        "预计视频奖励测试: 4"
      );
    }
  },
  postSign: async (axios, options) => {
    let phone = encryptPhone(options.user, "gb6YCccUvth75Tm2");
    let result = await axios.request({
      headers: {
        "user-agent": useragent(options),
        referer: `https://wxapp.msmds.cn/`,
        origin: "https://wxapp.msmds.cn",
      },
      url: `https://wxapp.msmds.cn/jplus/h5/greetGoldIngot/sign`,
      method: "POST",
      data: transParams({
        channelId: "LT_channel",
        phone: phone,
        token: options.ecs_token,
        sourceCode: "lt_ingots",
      }),
    });
    switch (result.data.code) {
      case 200:
        next(result.data.data);
        break;
      case 500:
        console.log("😒 聚宝盆签到:" + result.data["msg"]);
        return { double: false };
      default:
        throw new Error("❌ something errors: ", result.data.msg);
    }
    function next(data) {
      console.log("😒 聚宝盆签到获取积分:" + data["prizeName"]);
      console.log(
        "😒 聚宝盆签到翻倍状态:" + (data["double"] ? "可翻倍" : "不可翻倍"),
        "预计视频奖励测试: 4"
      );
      return { recordId: data["recordId"], double: data["double"] };
    }
  },
  signDouble: async (axios, options, cookies) => {
    console.log("😒 聚宝盆签到翻倍...测试");
    if (!cookies.double) {
      console.log("❌ 聚宝盆签到翻倍失败");
      return;
    }
    try {
      await ingotsPage.lookVideoDouble(axios, { ...options, ...cookies });
    } catch (err) {
      console.log("❌ 聚宝盆签到报错: ", err);
    }
  },
  // postCreditsDouble: (axios, options) => {},
  lookVideoDouble: async (axios, options) => {
    let params = {
      arguments1: "AC20200716103629", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "45d6dbc3ad144c938cfa6b8e81803b85", // yhTaskId menuId
      arguments4: new Date().getTime(), // time
      arguments6: "517050707",
      arguments7: "517050707",
      netWay: "Wifi",
      version: `android@8.0102`,
    };
    params["sign"] = sign([
      params.arguments1,
      params.arguments2,
      params.arguments3,
      params.arguments4,
    ]);
    let { num, jar } = await require("./taskcallback").query(axios, {
      ...options,
      params,
    });

    if (!num) {
      console.log("😒 签到小游戏聚宝盆: 今日已完成");
      return;
    }
    params = {
      arguments1: "AC20200716103629", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "73e3907bbf9c4748b2fe9a053cee5e82", // yhTaskId menuId
      arguments4: new Date().getTime(), // time
      arguments6: "",
      arguments7: "",
      arguments8: "",
      arguments9: "",
      orderId: crypto
        .createHash("md5")
        .update(new Date().getTime() + "")
        .digest("hex"),
      netWay: "Wifi",
      remark: "签到小游戏聚宝盆",
      version: `android@8.0100`,
      codeId: 945757412,
    };
    params["sign"] = sign([
      params.arguments1,
      params.arguments2,
      params.arguments3,
      params.arguments4,
    ]);
    await require("./taskcallback").doTask(axios, {
      ...options,
      params,
      jar,
    });
  },
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/ingotsPage?source=unicom&duanlianjieabc=tbLm0`,
    {
      base: "msmds",
    }
  ),
};

module.exports = ingotsPage;
