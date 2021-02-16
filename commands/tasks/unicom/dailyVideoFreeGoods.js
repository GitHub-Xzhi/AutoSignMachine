var crypto = require("crypto");
var moment = require("moment");
const gameEvents = require("./handlers/dailyEvent");
let { encryptPhone, sign, encrypt } = require("./handlers/PAES.js");
const { useragent } = require("./handlers/myPhone");
const {
  transParams,
  sleep,
  UnicomRequest,
  encodePhone,
} = require("./handlers/gameUtils");
// 签到小游戏买什么都省免费夺宝 [夺宝大挑战]

var dailyVideoFreeGoods = {
  // eslint-disable-next-line no-unused-vars
  getGoodsList: async (axios, options, { ecs_token, searchParams, jar1 }) => {
    let phone = encodePhone(options.user);
    let request = new UnicomRequest(axios, options);
    let body = {
      fromType: "22",
      status: "0",
      pageNo: "1",
      pageSize: "30",
      channelId: "LT_channel",
      phone: phone,
      token: ecs_token,
      sourceCode: "lt_freeTake",
    };
    let res = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/api/channel/integral/free/goods/findAll",
      body
    );
    let result = res.data;
    return {
      goods: result.data.goodsList.data,
      freeTimes: result.data.freeTimes,
      leftTimes: result.data.leftTimes,
      time: result.data.time,
      getFreeTime: result.data.getFreeTime,
      sameGoodsMaxTimes: result.data.sameGoodsMaxTimes,
    };
  },
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/freeTakePage`,
    { base: "msmds" }
  ),
  doTask: async (axios, options) => {
    console.log("🔔 开始夺宝大挑战\n");
    let cookies = await dailyVideoFreeGoods.getOpenPlatLine(axios, options);
    let {
      goods,
      freeTimes,
      leftTimes,
      time,
      // eslint-disable-next-line no-unused-vars
      getFreeTime,
      // eslint-disable-next-line no-unused-vars
      sameGoodsMaxTimes,
    } = await dailyVideoFreeGoods.getGoodsList(axios, options, cookies);
    console.log(
      "签到小游戏买什么都省免费夺宝",
      `剩余机会(${leftTimes}/${freeTimes})`
    );

    if (!leftTimes) {
      if (time) {
        console.log(
          `签到小游戏买什么都省免费夺宝: 剩余机会不足，等待下一轮,` +
            moment().add(time, "seconds").format("YYYY-MM-DD HH:mm:ss") +
            " 后可再次尝试"
        );
      }
    }

    let params = {
      arguments1: "",
      arguments2: "",
      arguments3: "",
      arguments4: new Date().getTime(),
      arguments6: "",
      arguments7: "",
      arguments8: "",
      arguments9: "",
      netWay: "Wifi",
      remark: "签到页小游戏",
      version: `android@8.0102`,
      codeId: 945535689,
    };
    params["sign"] = sign([
      params.arguments1,
      params.arguments2,
      params.arguments3,
      params.arguments4,
    ]);

    let phone = encodePhone(options.user);

    // 同一期商品最多3次机会，每4小时可获得5次机会
    console.log("注意本接口只获取积分！");
    console.log("抽奖时,可能会出现[不存在的奖品],此状态为无库存");
    let desc = (key) => {
      return (m, n) => {
        let a = m[key].replace("积分", "");
        let b = n[key].replace("积分", "");
        return b - a;
      };
    };
    let items = goods.filter((item) => {
      if (item.goodsName.indexOf("积分") > -1) {
        return item;
      }
    });
    for (let good of items.sort(desc("goodsName"))) {
      if (good.id !== null && good.goodsName.indexOf("积分") > -1) {
        console.log("开始抽奖: ", good.goodsName);
        params["orderId"] = crypto
          .createHash("md5")
          .update(new Date().getTime() + "")
          .digest("hex");
        params["arguments4"] = new Date().getTime();

        //请求抽奖次数情况
        console.log("查询抽奖时效");
        let timestamp = moment().format("YYYYMMDDHHmmss");
        let body = {
          channelId: "LT_channel",
          phone: phone,
          token: cookies.ecs_token,
          sourceCode: "lt_freeTake",
        };
        let request = new UnicomRequest(axios, options);
        let result = await request.getMsmds(
          "https://wxapp.msmds.cn/jplus/api/channel/integral/free/goods/getTimes",
          body,
          {
            referer: `https://wxapp.msmds.cn/h5/react_web/unicom/freeTakeGoodDetail/${good.id}?source=unicom&type=02&ticket=${cookies.searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${cookies.searchParams.postage}&userNumber=${options.user}`,
            origin: "https://wxapp.msmds.cn",
          }
        );
        // console.log(result.data);
        if (result.data.data.time) {
          console.log(
            `已处于限制期，` +
              moment()
                .add(result.data.data.time, "seconds")
                .format("YYYY-MM-DD HH:mm:ss") +
              " 后可再次尝试，跳过"
          );
          continue;
        }
        await sleep(30);
        console.log("查询抽奖接口");
        result = await require("./taskcallback").reward(axios, {
          ...options,
          params,
          jar: cookies.jar1,
        });

        timestamp = moment().format("YYYYMMDDHHmmss");
        body = {
          channelId: "LT_channel",
          code: "",
          flag: "",
          id: good.id,
          phone: phone,
          sourceCode: "lt_freeTake",
          taskId: "",
          token: cookies.ecs_token,
          videoOrderNo: params.orderId,
        };
        result = await request.postMsmds(
          "https://wxapp.msmds.cn/jplus/api/channel/integral/free/goods/doFreeGoods",
          body,
          {
            referer: `https://wxapp.msmds.cn/h5/react_web/unicom/freeTakeGoodDetail/${good.id}?source=unicom&type=02&ticket=${cookies.searchParams.ticket}&version=android@8.0102&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${cookies.searchParams.postage}&userNumber=${options.user}`,
            origin: "https://wxapp.msmds.cn",
          }
        );
        // console.log(result.data);
        if (result.data.code !== 2000) {
          console.log(result.data.msg);
        } else {
          if (result.data.data.luckCode) {
            console.log("提交任务成功", `券码：${result.data.data.luckCode}`);
          } else if (result.data.data.time) {
            throw new Error(
              `已处于限制期，` +
                moment()
                  .add(result.data.data.time, "seconds")
                  .format("YYYY-MM-DD HH:mm:ss") +
                " 后可再次尝试"
            );
          } else {
            console.log("提交任务成功");
          }
        }
        await sleep(25);
      }
    }
  },
};

module.exports = dailyVideoFreeGoods;
