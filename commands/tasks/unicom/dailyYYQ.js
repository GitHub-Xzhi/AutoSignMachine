var crypto = require("crypto");
let AES = require("./handlers/PAES");
const useragent = require("./handlers/myPhone").useragent;
const gameEvents = require("./handlers/dailyEvent");
let referer =
  "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/eggachine/index.html?id=Ac-da377d4512124eb49cc3ea4e0d25e379";
/**
 * 欢乐摇摇球
 * 入口:首页=>签到=>免费抽 摇一摇
 *
 */

let dailyYYQ = {
  doTask: async (axios, options) => {
    console.log("🔔 开始欢乐摇摇球\n");
    let cookies = await dailyYYQ.getOpenPlatLine(axios, options);
    let data = await dailyYYQ.postFreeLogin(axios, options, cookies);
    await dailyYYQ.postGame(axios, options, cookies, data);
  },
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://m.jf.10010.com/jf-order/avoidLogin/forActive/stxyndj`
  ),
  postFreeLogin: gameEvents.postFreeLogin(
    referer,
    "Ac-da377d4512124eb49cc3ea4e0d25e379"
  ),
  postGame: async (
    axios,
    options,
    // eslint-disable-next-line no-unused-vars
    { jfid, searchParams, jar1 },
    { activity, Authorization, freeTimes, advertTimes }
  ) => {
    let times = 5;
    // /jf-yuech/api/integralLogs/surplusFreeGame?activityId=Ac-da377d4512124eb49cc3ea4e0d25e379
    do {
      let orderId = "";
      console.log(
        "已消耗机会",
        1 + 4 - (freeTimes + advertTimes),
        "剩余免费机会",
        freeTimes,
        "看视频广告机会",
        advertTimes
      );

      //广告试听
      let res = await axios.request({
        headers: {
          Authorization: `Bearer ${Authorization}`,
          "user-agent": useragent(options),
          referer:
            "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/eggachine/index.html?id=" +
            activity.activityId,
          origin: "https://img.jf.10010.com",
        },
        url: `https://m.jf.10010.com/jf-yuech/api/gameResult/advertFreeGame?activityId=${activity.activityId}`,
        method: "get",
      });

      if (res.data.code !== 0) {
        console.log("签到小游戏视频买扭蛋机: " + res.data.message);
        break;
      }

      if (times < 5) {
        let params = {
          arguments1: "AC20200611152252",
          arguments2: "",
          arguments3: "",
          arguments4: new Date().getTime(),
          arguments6: "",
          arguments7: "",
          arguments8: "",
          arguments9: "",
          netWay: "Wifi",
          remark: "签到小游戏买扭蛋机2",
          version: `android@8.0102`,
          codeId: 945535686,
        };

        params["sign"] = AES.sign([
          params.arguments1,
          params.arguments2,
          params.arguments3,
          params.arguments4,
        ]);
        params["orderId"] = crypto
          .createHash("md5")
          .update(new Date().getTime() + "")
          .digest("hex");
        params["arguments4"] = new Date().getTime();

        await require("./taskcallback").reward(axios, {
          ...options,
          params,
          jar: jar1,
        });

        orderId = params["orderId"];
      }
      //join the game
      let t = {
        activityId: activity.activityId,
        version: 8.0102,
        orderId: orderId,
        phoneType: "android",
      };
      let params = gameEvents.encodeParams(t, true);
      res = await axios.request({
        headers: {
          Authorization: `Bearer ${Authorization}`,
          "user-agent": useragent(options),
          referer:
            "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/eggachine/index.html?id=Ac-da377d4512124eb49cc3ea4e0d25e379",
          origin: "https://m.jf.10010.com",
        },
        url: `https://m.jf.10010.com/jf-yuech/api/gameResult/twisingLuckDraw`,
        method: "post",
        data: params,
      });
      let result = res.data;
      if (result.code !== 0) {
        console.log("❌ 快乐摇摇球:", result.message);
      } else {
        console.log("🎉 快乐摇摇球:", result.data.prizeName);
        if (result.data.doublingStatus) {
          console.log("🎉 提交积分翻倍");
          await dailyYYQ.lookVideoDouble(axios, {
            ...options,
          });
          await dailyYYQ.lookVideoDoubleResult(axios, {
            ...options,
            Authorization,
            activityId: activity.activityId,
            winningRecordId: result.data.winningRecordId,
          });
        }
      }

      console.log("在看视频，等待35秒再继续");
      // eslint-disable-next-line no-unused-vars
      await new Promise((resolve, reject) => setTimeout(resolve, 35 * 1000));
    } while (--times);
  },
  lookVideoDouble: async (axios, options) => {
    let params = {
      arguments1: "AC20200611152252", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "73e3907bbf9c4748b2fe9a053cee5e82", // yhTaskId menuId
      arguments4: new Date().getTime(), // time
      arguments6: "517050707",
      netWay: "Wifi",
      version: `android@8.0100`,
    };
    params["sign"] = AES.sign([
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
      console.log("签到小游戏买扭蛋机2: 今日已完成");
      return;
    }
    params = {
      arguments1: "AC20200611152252", // acid
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
      remark: "签到小游戏买扭蛋机2",
      version: `android@8.0100`,
      codeId: 945535686,
    };
    params["sign"] = AES.sign([
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
  lookVideoDoubleResult: gameEvents.lookVideoDoubleResult(
    "签到小游戏买扭蛋机2"
  ),
};

module.exports = dailyYYQ;
