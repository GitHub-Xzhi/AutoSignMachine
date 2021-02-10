let crypto = require("crypto");
let moment = require("moment");
let { encryptPhone } = require("./handlers/PAES.js");
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
        return null;
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
    console.log("😒 聚宝盆签到翻倍...待完善");
    // let params = {
    //   arguments1: "AC20200611152252",
    //   arguments2: "",
    //   arguments3: "",
    //   arguments4: new Date().getTime(),
    //   arguments6: "",
    //   arguments7: "",
    //   arguments8: "",
    //   arguments9: "",
    //   netWay: "Wifi",
    //   remark: "签到小游戏买扭蛋机2",
    //   version: `android@8.0102`,
    //   codeId: 945535686,
    // };

    // params["sign"] = AES.sign([
    //   params.arguments1,
    //   params.arguments2,
    //   params.arguments3,
    //   params.arguments4,
    // ]);
    // params["orderId"] = crypto
    //   .createHash("md5")
    //   .update(new Date().getTime() + "")
    //   .digest("hex");
    // params["arguments4"] = new Date().getTime();

    // await require("./taskcallback").reward(axios, {
    //   ...options,
    //   params,
    //   jar: jar1,
    // });
  },
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/ingotsPage?source=unicom&duanlianjieabc=tbLm0`,
    {
      base: "msmds",
    }
  ),
};

module.exports = ingotsPage;
