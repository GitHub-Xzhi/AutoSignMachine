var crypto = require("crypto");
const useragent = require("./handlers/myPhone").useragent;
const gameEvents = require("./handlers/dailyEvent");
// 疯狂刮刮乐
var transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data["" + item + ""]);
  }
  return params;
};
function w() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
    t = [];
  return (
    Object.keys(e).forEach(function (a) {
      t.push("".concat(a, "=").concat(encodeURIComponent(e[a])));
    }),
    t.join("&")
  );
}
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

function encryption(data, key) {
  var iv = "";
  var cipherEncoding = "base64";
  var cipher = crypto.createCipheriv("aes-128-ecb", key, iv);
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString(
    cipherEncoding
  );
}

var dailyVideoScratchcard = {
  getGoodsList: async (axios, options) => {
    let phone = encryption(options.user, "gb6YCccUvth75Tm2");
    let result = await axios.request({
      headers: {
        "user-agent": useragent(options),
        referer: `https://wxapp.msmds.cn/`,
        origin: "https://wxapp.msmds.cn",
      },
      url: `https://wxapp.msmds.cn/jplus/h5/channelScratchCard/findAllCard`,
      method: "GET",
      params: transParams({
        channelId: "LT_channel",
        phone: phone,
        token: options.ecs_token,
        sourceCode: "lt_scratchcard",
      }),
    });
    return result.data.data.allCards.filter((c) => !c.status);
  },
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/scratchcardPage?source=unicom&duanlianjieabc=tbkR2`,
    { base: "msmds" }
  ),
  doTask: async (axios, options) => {
    console.log("🤔 刮刮卡游玩开始...");
    let { ecs_token, jar1 } = await dailyVideoScratchcard.getOpenPlatLine(
      axios,
      options
    );
    let phone = encryption(options.user, "gb6YCccUvth75Tm2");
    let goods = await dailyVideoScratchcard.getGoodsList(axios, {
      ...options,
      ecs_token,
      phone,
    });

    let params = {
      arguments1: "AC20200716103629",
      arguments2: "GGPD",
      arguments3: "79b0275d6a5742ce96af76a663cde0ab",
      arguments4: new Date().getTime(),
      arguments6: "517050707",
      arguments7: "517050707",
      arguments8: "123456",
      arguments9: "4640b530b3f7481bb5821c6871854ce5",
      netWay: "Wifi",
      remark: "签到小游戏幸运刮刮卡",
      version: `android@8.0102`,
      codeId: 945597742,
    };
    params["sign"] = sign([
      params.arguments1,
      params.arguments2,
      params.arguments3,
      params.arguments4,
    ]);

    if (goods.length) {
      for (let good of goods) {
        console.log("开始处理: ", good.name);
        params["orderId"] = crypto
          .createHash("md5")
          .update(new Date().getTime() + "")
          .digest("hex");
        params["arguments4"] = new Date().getTime();

        let result = await require("./taskcallback").reward(axios, {
          ...options,
          params,
          jar: jar1,
        });
        let a = {
          channelId: "LT_channel",
          phone: phone,
          token: ecs_token,
          cardId: good.id,
          sourceCode: "lt_scratchcard",
        };
        result = await axios.request({
          headers: {
            "user-agent": useragent(options),
            referer: `https://wxapp.msmds.cn/h5/react_web/unicom/scratchcardItemPage`,
            origin: "https://wxapp.msmds.cn",
          },
          url:
            `https://wxapp.msmds.cn/jplus/h5/channelScratchCard/doScratchCard?` +
            w(a),
          method: "GET",
        });
        if (result.data.code !== 200) {
          console.log(result.data.msg);
        } else {
          console.log(
            "提交任务成功",
            `+${result.data.data.prizeType ? result.data.data.integral : 0}`
          );
          let a = {
            channelId: "LT_channel",
            phone: phone,
            token: ecs_token,
            id: good.id,
            sourceCode: "lt_scratchcard",
          };
          console.log("测试 视频翻倍");
          result = await axios.request({
            headers: {
              "user-agent": useragent(options),
              referer: `https://wxapp.msmds.cn/h5/react_web/unicom/scratchcardItemPage`,
              origin: "https://wxapp.msmds.cn",
            },
            url: `https://wxapp.msmds.cn/jplus/h5/channelScratchCard/lookVideoDouble`,
            method: "POST",
            data: w(a),
          });

          await dailyVideoScratchcard.lookVideoDouble(axios, {
            ...options,
          });
        }
        console.log("等待35秒再继续");
        // eslint-disable-next-line no-unused-vars
        await new Promise((resolve, reject) => setTimeout(resolve, 35 * 1000));
      }
    } else {
      console.log("暂无可刮得商品");
    }
  },
  lookVideoDouble: gameEvents.lookVideoDouble(
    {
      arguments1: "AC20200716103629",
      arguments2: "GGPD",
      arguments3: "79b0275d6a5742ce96af76a663cde0ab",
      arguments4: new Date().getTime(),
      arguments6: "517050707",
      arguments7: "517050707",
      arguments8: "123456",
      arguments9: "4640b530b3f7481bb5821c6871854ce5",
      netWay: "Wifi",
      remark1: "签到小游戏幸运刮刮卡",
      remark: "签到看视频翻倍得积分",
      version: `android@8.0102`,
      codeId: 945689604,
    },
    {
      arguments1: "AC20200716103629", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "79b0275d6a5742ce96af76a663cde0ab", // yhTaskId menuId
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
    "幸运刮刮卡"
  ),
  lookVideoDoubleResult: gameEvents.lookVideoDoubleResult("幸运刮刮卡"),
};

module.exports = dailyVideoScratchcard;
