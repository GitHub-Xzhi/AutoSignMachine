var crypto = require("crypto");

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
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `;
    let result = await axios.request({
      headers: {
        "user-agent": useragent,
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
  doTask: async (axios, options) => {
    console.log("🤔 刮刮卡游玩开始...");
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`;
    let searchParams = {};
    let result = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": useragent,
          referer: `https://img.client.10010.com/`,
          origin: "https://img.client.10010.com",
        },
        url: `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/scratchcardPage?source=unicom&duanlianjieabc=tbkR2`,
        method: "get",
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
    let ecs_token = cookiesJson.cookies.find((i) => i.key == "ecs_token");
    if (!ecs_token) {
      throw new Error("ecs_token缺失");
    }
    ecs_token = ecs_token.value;

    let phone = encryption(options.user, "gb6YCccUvth75Tm2");

    let goods = await dailyVideoScratchcard.getGoodsList(axios, {
      ...options,
      ecs_token,
      phone,
    });

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
      remark: "签到小游戏幸运刮刮卡",
      version: `android@8.0100`,
      codeId: 945597731,
    };
    params["sign"] = sign([
      params.arguments1,
      params.arguments2,
      params.arguments3,
      params.arguments4,
    ]);

    if (goods.length) {
      for (let good of goods) {
        console.log("开始处理", good.name);
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
        let a = {
          channelId: "LT_channel",
          phone: phone,
          token: ecs_token,
          cardId: good.id,
          sourceCode: "lt_scratchcard",
        };
        result = await axios.request({
          headers: {
            "user-agent": useragent,
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
        }
        console.log("等待15秒再继续");
        await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000));
      }
    } else {
      console.log("暂无可刮得商品");
    }
  },
  lookVideoDouble: async (axios, options) => {
    let params = {
      arguments1: "AC20200611152252",
      arguments2: "GGPD",
      arguments3: "4640b530b3f7481bb5821c6871854ce5",
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

module.exports = dailyVideoScratchcard;
