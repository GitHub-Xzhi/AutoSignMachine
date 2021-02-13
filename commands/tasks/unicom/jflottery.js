var crypto = require("crypto");
let moment = require("moment");
let { sign } = require("./handlers/PAES");
const gameEvents = require("./handlers/dailyEvent");
const referer =
  "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/yuech-Blindbox/tigerarm/index.html?jump=sign";
// 豪礼大派送
const useragent = require("./handlers/myPhone").useragent;
let jflottery;
module.exports = jflottery = {
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://m.jf.10010.com/jf-order/avoidLogin/forActive/tigerarmqd&duanlianjieabc=tbkyH`
  ),
  postFreeLoginRock: gameEvents.postFreeLoginRock(
    referer,
    "Ac-de644531df54410e875ba08ca2256b6a"
  ),
  doTask: async (axios, options) => {
    console.log("🔔 开始666积分\n");
    let cookies = await jflottery.getOpenPlatLine(axios, options);
    let data = await jflottery.postFreeLoginRock(axios, options, cookies);
    await jflottery.postTimesDraw(axios, options, cookies, data);
  },
  postTimesDraw: async (
    axios,
    options,
    // eslint-disable-next-line no-unused-vars
    { jfid, searchParams, jar1 },
    { activity, Authorization, freeTimes, advertTimes }
  ) => {
    do {
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
      //   let currentTimes = 1 + 4 - (freeTimes + advertTimes) + 1;

      let p1 = {
        activityId: activity.activityId,
        currentTimes: freeTimes,
        type: "积分",
      };

      if (!freeTimes && advertTimes) {
        let params = {
          arguments1: "AC20200611152252",
          arguments2: "GGPD",
          arguments3: "",
          arguments4: new Date().getTime(),
          arguments6: "517050707",
          arguments7: "517050707",
          arguments8: "123456",
          arguments9: "",
          netWay: "Wifi",
          remark1: "到小游戏豪礼派送",
          remark: "签到小游戏翻倍得积分",
          version: `android@8.0102`,
          codeId: 945705532,
        };
        params["sign"] = sign([
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

        let timestamp = moment().format("YYYYMMDDHHmmss");
        await axios.request({
          headers: {
            "user-agent": useragent(options),
            referer: `https://img.client.10010.com/`,
          },
          url: `https://m.jf.10010.com/jf-order/avoidLogin/forActive/tigerarmqd?ticket=${searchParams.ticket}&type=02&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbLlf&userNumber=${options.user}`,
          method: "GET",
        });

        p1 = {
          activityId: activity.activityId,
          currentTimes: advertTimes,
          type: "广告",
          orderId: params["orderId"],
          phoneType: "android",
          version: "8.0102",
        };
        advertTimes--;
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
            referer: "https://m.jf.10010.com",
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
        console.log("豪礼大派送抽奖:", result.message);
      } else {
        if (result.data.consumptionV1Infos.code !== "0") {
          console.log("豪礼大派送抽奖:", result.data.consumptionV1Infos.result);
        } else {
          if (
            result.data.consumptionV1Infos.gameResult.prizeStatus === "中奖"
          ) {
            if (result.data.consumptionV1Infos.gameResult.integralScore) {
              console.log(
                "🔔 豪礼大派送抽奖:",
                "中奖+",
                result.data.consumptionV1Infos.gameResult.integralScore
              );
            } else {
              console.log(result.data.consumptionV1Infos);
              console.log("🔔 豪礼大派送抽奖:", "中奖");
            }
          } else {
            console.log(
              "豪礼大派送抽奖:",
              result.data.consumptionV1Infos.gameResult.prizeStatus
            );
          }
          if (
            result.data.drawResultPO !== null &&
            result.data.drawResultPO.doublingStatus
          ) {
            console.log("🌈 提交积分翻倍");
            await jflottery.lookVideoDouble(axios, {
              ...options,
            });
            await jflottery.lookVideoDoubleResult(axios, {
              ...options,
              Authorization,
              activityId: activity.activityId,
              winningRecordId: result.data.drawResultPO.winningRecordId,
            });
          }
        }
      }

      console.log("☕ 喘口气歇会，等待35秒再继续");
      // eslint-disable-next-line no-unused-vars
      await new Promise((resolve, reject) => setTimeout(resolve, 35 * 1000));
    } while (freeTimes || advertTimes);
  },
  lookVideoDouble: async (axios, options) => {
    let params = {
      arguments1: "AC20200611152252", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "627292f1243148159c58fd58917c3e67", // yhTaskId menuId
      arguments4: new Date().getTime(),
      arguments6: "517050707",
      arguments7: "517050707",
      arguments8: "123456",
      arguments9: "4640b530b3f7481bb5821c6871854ce5",
      netWay: "Wifi",
      remark1: "签到小游戏豪礼派送",
      remark: "签到小游戏翻倍得积分",
      version: `android@8.0102`,
      codeId: 945689604,
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
      console.log("签到小游戏翻牛牌: 今日已完成");
      return;
    }

    params = {
      arguments1: "AC20200611152252", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "627292f1243148159c58fd58917c3e67", // yhTaskId menuId
      arguments4: new Date().getTime(), // time
      arguments6: "517050707",
      arguments7: "517050707",
      arguments8: "123456",
      arguments9: "4640b530b3f7481bb5821c6871854ce5",
      orderId: crypto
        .createHash("md5")
        .update(new Date().getTime() + "")
        .digest("hex"),
      netWay: "Wifi",
      remark: "签到看视频翻倍得积分",
      version: `android@8.0102`,
      codeId: 945689604,
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
  lookVideoDoubleResult: gameEvents.lookVideoDoubleResult("豪礼大派送"),
};
