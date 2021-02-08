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
    let data = await dailyYYQ.postFreeLoginRock(axios, options, cookies);
    await dailyYYQ.postGame(axios, options, cookies, data);
  },
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://m.jf.10010.com/jf-order/avoidLogin/forActive/stxyndj`
  ),
  postFreeLoginRock: gameEvents.postFreeLoginRock(referer, "freeLogin"),
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

      let res = await axios.request({
        headers: {
          Authorization: `Bearer ${Authorization}`,
          "user-agent": useragent,
          referer:
            "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/eggachine/index.html?id=" +
            activity.activityId,
          origin: "https://img.jf.10010.com",
        },
        url: `https://m.jf.10010.com/jf-yuech/api/gameResult/advertFreeGame?activityId=${activity.activityId}`,
        method: "get",
      });

      if (res.data.code !== 0) {
        console.log("签到小游戏买扭蛋机2: " + res.data.message);
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
          version: `android@8.0100`,
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

      let n = Math.floor(5 * Math.random());
      let i = AES.secretkeyArray();

      let t = {
        activityId: activity.activityId,
        version: 8.01,
        orderId: orderId,
        phoneType: "android",
      };
      let params = {
        params: AES.encrypt(JSON.stringify(t), i[n]) + n,
        parKey: i,
      };
      res = await axios.request({
        headers: {
          Authorization: `Bearer ${Authorization}`,
          "user-agent": useragent,
          referer:
            "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/eggachine/index.html?id=Ac-da377d4512124eb49cc3ea4e0d25e379",
          origin: "https://img.jf.10010.com",
        },
        url: `https://m.jf.10010.com/jf-yuech/api/gameResult/advertLuckDraw`,
        method: "post",
        data: params,
      });
      let result = res.data;
      if (result.code !== 0) {
        console.log("快乐摇摇球:", result.message);
      } else {
        console.log("快乐摇摇球:", result.data.prizeName);
        if (result.data.doublingStatus) {
          console.log("提交积分翻倍");
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

      console.log("等待15秒再继续");
      // eslint-disable-next-line no-unused-vars
      await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000));
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
  lookVideoDoubleResult: async (axios, options) => {
    let { Authorization, activityId, winningRecordId } = options;
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`;
    let res = await axios.request({
      headers: {
        Authorization: `Bearer ${Authorization}`,
        "user-agent": useragent,
        referer: "https://img.jf.10010.com/",
        origin: "https://img.jf.10010.com",
      },
      url: `https://m.jf.10010.com/jf-yuech/api/gameResult/doublingIntegral?activityId=${activityId}&winningRecordId=${winningRecordId}`,
      method: "get",
    });
    let result = res.data;
    if (result.code !== 0) {
      console.log("签到小游戏买扭蛋机2翻倍结果:", result.message);
    } else {
      console.log("签到小游戏买扭蛋机2翻倍结果:", result.data);
    }
  },
};

module.exports = dailyYYQ;
