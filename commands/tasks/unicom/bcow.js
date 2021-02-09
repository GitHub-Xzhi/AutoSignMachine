let crypto = require("crypto");
let moment = require("moment");
let AES = require("./handlers/PAES.js");
const useragent = require("./handlers/myPhone").useragent;
const gameEvents = require("./handlers/dailyEvent");
const referer =
  "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/yuech-qd/bcow/index.html?jump=sign";
/**
 * 入口:首页=>签到=>免费抽 赢牛拿奖
 */
let bcow;
module.exports = bcow = {
  doTask: async (axios, options) => {
    console.log("🔔 开始翻牛牌\n");
    let cookies = await bcow.getOpenPlatLine(axios, options);
    let data = await bcow.postFreeLoginRock(axios, options, cookies);
    await bcow.postTimesDrawForPrize(axios, options, cookies, data);
  },
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://m.jf.10010.com/jf-order/avoidLogin/forActive/ncow&duanlianjieabc=tbLlf`
  ),
  postFreeLoginRock: gameEvents.postFreeLoginRock(referer, "Ac-yccnk"),
  postTimesDrawForPrize: async (
    axios,
    options,
    // eslint-disable-next-line no-unused-vars
    { jfid, searchParams, jar1 },
    { activity, Authorization, freeTimes, advertTimes }
  ) => {
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

      if (!freeTimes && !advertTimes) {
        console.log("没有游戏次数");
        break;
      }

      // let currentTimes = 1 + 4 - (freeTimes + advertTimes) + 1;

      let p1 = {
        activityId: activity.activityId,
        currentTimes: freeTimes,
        type: "免费",
      };

      //check game time information
      if (!freeTimes && advertTimes) {
        let params = {
          arguments1: "AC20200611152252",
          arguments2: "GGPD",
          arguments3: "627292f1243148159c58fd58917c3e67",
          arguments4: new Date().getTime(),
          arguments6: "517050707",
          arguments7: "517050707",
          arguments8: "123456",
          arguments9: "4640b530b3f7481bb5821c6871854ce5",
          netWay: "Wifi",
          remark1: "签到翻牛牌活动",
          remark: "签到看视频翻倍得积分",
          version: `android@8.0102`,
          codeId: 945689604,
        };
        params["sign"] = AES.sign([
          params.arguments1,
          params.arguments2,
          params.arguments3,
          params.arguments4,
          params.arguments6,
          params.arguments7,
          params.arguments8,
          params.arguments9,
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

        let timestamp = moment().format("YYYYMMDDHHmmss");
        await axios.request({
          headers: {
            "user-agent": useragent(options),
            referer: `https://img.client.10010.com/`,
          },
          url: `https://m.jf.10010.com/jf-order/avoidLogin/forActive/ncow?ticket=${searchParams.ticket}&type=02&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbLlf&userNumber=${options.user}`,
          method: "GET",
        });

        orderId = params["orderId"];
        p1 = {
          activityId: activity.activityId,
          currentTimes: advertTimes,
          type: "广告",
          orderId: orderId,
          phoneType: "android",
          version: "8.0102",
        };
        advertTimes--;
        // eslint-disable-next-line no-unused-vars
      } else {
        freeTimes--;
      }

      //join the game
      let params = gameEvents.encodeParams(p1, true);
      let res = await axios
        .request({
          baseURL: "https://m.jf.10010.com/",
          headers: {
            Authorization: `Bearer ${Authorization}`,
            "user-agent": useragent(options),
            referer,
            origin: "https://m.jf.10010.com",
            "Content-Type": "application/json;charset=UTF-8",
          },
          url: `/jf-yuech/api/gameResultV2/timesDrawForPrize`,
          method: "post",
          data: params,
        })
        .catch((err) => console.log(err));

      let result = res.data;
      if (result.code !== 0) {
        console.log("翻牛牌送好礼:", result.message);
      } else {
        console.log(
          "翻牛牌送好礼:",
          result.data.drawResultPO !== null
            ? result.data.drawResultPO.prizeName
            : "未中奖"
        );
        if (
          result.data.drawResultPO !== null &&
          result.data.drawResultPO.doublingStatus
        ) {
          console.log("🌈 提交积分翻倍");
          await bcow.lookVideoDouble(axios, {
            ...options,
          });
          await bcow.lookVideoDoubleResult(axios, {
            ...options,
            Authorization,
            activityId: activity.activityId,
            winningRecordId: result.data.drawResultPO.winningRecordId,
          });
        }
      }
    } while (freeTimes || advertTimes);
  },
  lookVideoDouble: async (axios, options) => {
    let params = {
      arguments1: "AC20200611152252",
      arguments2: "GGPD",
      arguments3: "627292f1243148159c58fd58917c3e67",
      arguments4: new Date().getTime(),
      arguments6: "517050707",
      arguments7: "517050707",
      arguments8: "123456",
      arguments9: "4640b530b3f7481bb5821c6871854ce5",
      netWay: "Wifi",
      remark1: "签到翻牛牌活动",
      remark: "签到看视频翻倍得积分",
      version: `android@8.0102`,
      codeId: 945689604,
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
      console.log("签到小游戏翻牛牌: 今日已完成");
      return;
    }

    params = {
      arguments1: "AC20200611152252", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "627292f1243148159c58fd58917c3e67", // yhTaskId menuId
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
      remark: "签到小游戏翻牛牌",
      version: `android@8.0100`,
      codeId: 945689604,
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
  lookVideoDoubleResult: gameEvents.lookVideoDoubleResult("翻牛牌送好礼"),
};
