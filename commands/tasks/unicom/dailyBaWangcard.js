var crypto = require("crypto");
var moment = require("moment");
const gameEvents = require("./handlers/dailyEvent");
let { sign } = require("./handlers/PAES.js");
const { sleep, UnicomRequest, encodePhone } = require("./handlers/gameUtils");
// 霸王餐刮刮卡
let dailyBaWangcard = {
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/luckCardPage&duanlianjieabc=tbkd2`,
    { base: "msmds" }
  ),
  doTask: async (axios, options) => {
    console.log("🤔 刮刮霸王餐开始...");
    let phone = encodePhone(options.user);
    let cookies = await dailyBaWangcard.getOpenPlatLine(axios, options);
    let times = await dailyBaWangcard.getScratchCardNum(axios, options, {
      ...cookies,
      phone,
    });
    await dailyBaWangcard.postScratch(
      axios,
      options,
      { ...cookies, phone },
      times
    );
  },
  getScratchCardNum: async (
    axios,
    options,
    // eslint-disable-next-line no-unused-vars
    { ecs_token, searchParams, jar1, phone }
  ) => {
    let request = new UnicomRequest(axios, options);
    let result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/api/scratchCardRecord/getScratchCardNum",
      {
        channelId: "unicom_scratch_card",
        phone: phone,
        token: ecs_token,
      },
      {
        referer: `https://wxapp.msmds.cn/`,
        origin: "https://wxapp.msmds.cn",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    return {
      freeTimes: result.data.data.surplusNum,
      advertTimes: result.data.data.canLookVideo
        ? 4 - result.data.data.playNum
        : 0,
    };
  },
  postScratch: async (
    axios,
    options,
    { ecs_token, searchParams, jar1, phone },
    { freeTimes, advertTimes }
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
      if (!freeTimes && advertTimes) {
        console.log("视频补充");
        let params = {
          arguments1: "AC20200716103629", // acid
          arguments2: "GGPD", // yhChannel
          arguments3: "9e368d7f6c474cc8a1491d6a9fabad45", // yhTaskId menuId
          arguments4: new Date().getTime(), // time
          arguments6: "517050707",
          arguments7: "517050707",
          arguments8: "123456",
          arguments9: "4640b530b3f7481bb5821c6871854ce5",
          netWay: "Wifi",
          remark1: "签到小游戏刮刮卡",
          remark: "签到页小游戏",
          version: `android@8.0102`,
          codeId: 945363379,
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
        console.log("看视频广告中...");
        let result = await require("./taskcallback").reward(axios, {
          ...options,
          params,
          jar: jar1,
        });
        console.log(`广告ID:`, result["orderId"]);
        let body = {
          channelId: "unicom_scratch_card",
          phone: phone,
          num: advertTimes,
          token: ecs_token,
          videoOrderNo: params["orderId"],
        };
        let request = new UnicomRequest(axios, options);
        let timestamp = moment().format("YYYYMMDDHHmmss");
        let { data } = await request.postMsmds(
          "https://wxapp.msmds.cn/jplus/api/scratchCardRecord/addScratchCardNum",
          body,
          {
            referer: `https://wxapp.msmds.cn/h5/react_web/unicom/luckCardPage?source=unicom&type=06&ticket=${searchParams.ticket}&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbkd2&userNumber=${options.user}`,
          }
        );

        console.log("观看视频得机会...");
        await sleep(30);
        if (data.code !== 200) {
          console.log("提交任务失败", data.msg);
          break;
        } else {
          console.log("提交任务成功", `${data.data.msg}`);
        }
        advertTimes--;
      } else {
        freeTimes--;
      }

      let body = {
        channelId: "unicom_scratch_card",
        phone: phone,
        token: ecs_token,
        flag: "",
        taskId: "",
      };
      // https://wxapp.msmds.cn/h5/react_web/unicom/luckCardPage?ticket=nep4v4jza360c1dc9a946b8c51c892d7f3af8f02jadbs3o7&type=06&version=iphone_c@8.0102&timestamp=20210214112354&desmobile=这是电话号码&num=0&postage=494bef815366a0e8007c66d19f38ec07&duanlianjieabc=tbkd2&userNumber=这是电话号码
      let request = new UnicomRequest(axios, options);
      let timestamp = moment().format("YYYYMMDDHHmmss");
      let { data } = await request.postMsmds(
        "https://wxapp.msmds.cn/jplus/api/scratchCardRecord/scratchCard",
        body,
        {
          referer: `https://wxapp.msmds.cn/h5/react_web/unicom/luckCardPage?source=unicom&type=06&ticket=${searchParams.ticket}&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbkd2&userNumber=${options.user}`,
        }
      );
      console.log(
        "🎉 刮刮卡结果:",
        data.data.msg,
        data.data.giftNum ? `+${data.data.giftNum}积分` : ""
      );
      if (data.data["canDouble"]) {
        console.log("准备翻倍积分...");
        await sleep(30);
        await dailyBaWangcard.lookVideoDouble(axios, options);
      }
      await sleep(15);
      //对循环多跑一次
    } while (freeTimes >= 0 || advertTimes > 0);
  },
  lookVideoDouble: gameEvents.lookVideoDouble(
    {
      arguments1: "AC20200716103629",
      arguments2: "GGPD",
      arguments3: "9e368d7f6c474cc8a1491d6a9fabad45",
      arguments4: new Date().getTime(),
      arguments6: "517050707",
      netWay: "Wifi",
      version: `android@8.0102`,
    },
    {
      arguments1: "AC20200716103629", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "9e368d7f6c474cc8a1491d6a9fabad45", // yhTaskId menuId
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
      remark: "签到小游戏翻倍得积分",
      version: `android@8.0102`,
      codeId: 945689604,
    },
    "刮刮卡"
  ),
};

module.exports = dailyBaWangcard;
