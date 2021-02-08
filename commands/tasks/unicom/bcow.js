let crypto = require("crypto");
let CryptoJS = require("crypto-js");
let moment = require("moment");
let AES = require("./handlers/PAES");
const useragent = (options) =>
  `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0102,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`;
module.exports = bcow = {
  doTask: async (axios, options) => {
    console.log("🔔开始抽牛卡\n");
    let cookies = await getOpenPlatLine(axios, options);
    let data = await postFreeLoginRock(axios, options, cookies);
  },
  getOpenPlatLine: async (axios, options) => {
    let searchParams = {};
    let result = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": useragent(options),
          referer: `https://img.client.10010.com/`,
          origin: "https://img.client.10010.com",
        },
        url: `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://m.jf.10010.com/jf-order/avoidLogin/forActive/ncow&duanlianjieabc=tbLlf`,
        method: "GET",
        transformResponse: (data, headers) => {
          if ("location" in headers) {
            let uu = new URL(headers.location);
            let pp = {};
            for (let p of uu.searchParams) {
              pp[p[0]] = p[1];
            }
            if ("ticket" in pp) {
              searchParams = pp;
            }
          }
          return data;
        },
      })
      .catch((err) => console.log(err));
    let jar1 = result.config.jar;

    let cookiesJson = jar1.toJSON();
    console.log(cookiesJson);
    let ecs_token = cookiesJson.cookies.find((i) => i.key == "ecs_token");
    if (!ecs_token) {
      throw new Error("ecs_token缺失");
    }
    ecs_token = ecs_token.value;
    let jfid = cookiesJson.cookies.find((i) => i.key == "_jf_id");
    if (!jfid) {
      throw new Error("jfid缺失");
    }
    jfid = jfid.value;
    return { jfid, searchParams, jar1 };
  },
  postFreeLoginRock: async (axios, options, { jfid, searchParams, jar1 }) => {
    let keyArr = AES.secretkeyArray();
    let keyrdm = Math.floor(Math.random() * 5);

    let params = {
      activityId: "Ac-yccnk",
      userCookie: jfid,
      userNumber: searchParams.userNumber,
      time: new Date().getTime(),
    };
    let reqdata = {
      params: encrypt(JSON.stringify(params), keyArr[keyrdm]) + keyrdm,
      parKey: keyArr,
    };
    //foods list
    let res = await axios
      .request({
        baseURL: "https://m.jf.10010.com/",
        headers: {
          "user-agent": useragent(options),
          referer:
            "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/yuech-qd/bcow/index.html?jump=sign",
          origin: "https://img.jf.10010.com",
          "Content-Type": "application/json",
        },
        jar: jar1,
        url: `/jf-yuech/p/freeLoginRock`,
        method: "post",
        data: reqdata,
      })
      .catch((err) => console.log(err));

    result = res.data;
    if (result.code !== 0) {
      throw new Error(result.message);
    }
    let activity = result.data.activityInfos.activityVOs[0]; //available items on the list from request
    let Authorization = result.data.token.access_token;
    let freeTimes = activity.activityTimesInfo.freeTimes;
    let advertTimes = activity.activityTimesInfo.advertTimes;
    return { activity, Authorization, freeTimes, advertTimes };
  },
  postTimesDrawForPrize: async (
    axios,
    options,
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

      let currentTimes = 1 + 4 - (freeTimes + advertTimes) + 1;

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
        params["sign"] = sign([
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

        result = await require("./taskcallback").reward(axios, {
          ...options,
          params,
          jar: jar1,
        });

        let timestamp = moment().format("YYYYMMDDHHmmss");
        result = await axios.request({
          headers: {
            "user-agent": useragent(options),
            referer: `https://img.client.10010.com/`,
          },
          url: `https://m.jf.10010.com/jf-order/avoidLogin/forActive/ncow?ticket=${searchParams.ticket}&type=02&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbLlf&userNumber=${options.user}`,
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
        orderId = params["orderId"];
      } else {
        freeTimes--;
      }

      //join the game
      let n = Math.floor(5 * Math.random());
      let i = newjiamarr();
      params = {
        params: encrypt(JSON.stringify(p1), i["zfc"]) + n,
        parKey: i["arr"],
      };

      res = await axios
        .request({
          baseURL: "https://m.jf.10010.com/",
          headers: {
            Authorization: `Bearer ${Authorization}`,
            "user-agent": useragent(options),
            referer:
              "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/yuech-qd/bcow/index.html?jump=sign",
            origin: "https://m.jf.10010.com",
            "Content-Type": "application/json;charset=UTF-8",
          },
          url: `/jf-yuech/api/gameResultV2/timesDrawForPrize`,
          method: "post",
          data: params,
        })
        .catch((err) => console.log(err));

      console.log(res.data);
      if (res.data.code !== 0) {
        throw new Error(res.data.message);
      } else {
        if (res.data.data.code !== "0") {
          throw new Error(res.data.data.result);
        }
      }

      //TODO: coding in here now...
      result = res.data;
      if (result.code !== 0) {
        console.log("翻牛牌送好礼:", result.message);
      } else {
        console.log(
          "翻牛牌送好礼:",
          result.data.status === "中奖"
            ? result.data.prizeName
            : result.data.status
        );
        if (result.data.doublingStatus) {
          console.log("提交积分翻倍");
          await dailyYYY.lookVideoDouble(axios, {
            ...options,
          });
          await dailyYYY.lookVideoDoubleResult(axios, {
            ...options,
            Authorization,
            activityId: activity.activityId,
            winningRecordId: result.data.winningRecordId,
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
    result = res.data;
    if (result.code !== 0) {
      console.log("翻牛牌送好礼翻倍结果:", result.message);
    } else {
      console.log("翻牛牌送好礼翻倍结果:", result.data);
    }
  },
};
