var crypto = require("crypto");
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
let account = {
  yhTaskId: "10e36b51060a46499e48082656602bf8",
  yhChannel: "GGPD",
  accountChannel: "517050707",
  accountUserName: "517050707",
  accountPassword: "123456",
  accountToken: "4640b530b3f7481bb5821c6871854ce5",
};
var threeSquirrels = {
  query: async (request, options) => {
    let params = {
      arguments1: "AC20200624091508", // acid
      arguments2: account.yhChannel, // yhChannel
      arguments3: account.yhTaskId, // yhTaskId menuId
      arguments4: new Date().getTime(), // time
      arguments6: account.accountChannel,
      netWay: "Wifi",
      version: `android@8.0102`,
    };
    params["sign"] = sign([
      params.arguments1,
      params.arguments2,
      params.arguments3,
      params.arguments4,
    ]);
    return await require("./taskcallback").query(request, {
      ...options,
      params,
    });
  },
  doTask: async (request, options) => {
    console.log("🐀 三只松鼠看视频得积分...");
    let { num, jar } = await threeSquirrels.query(request, options);
    if (!num) {
      console.log("🐀 三只松鼠看视频得积分: 今日已完成");
      return;
    }
    do {
      console.log("第", num, "次");
      let params = {
        arguments1: "AC20200624091508", // acid
        arguments2: account.yhChannel, // yhChannel
        arguments3: account.yhTaskId, // yhTaskId menuId
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
        remark: "支付页",
        version: `android@8.0100`,
        codeId: 945535636,
      };
      params["sign"] = sign([
        params.arguments1,
        params.arguments2,
        params.arguments3,
        params.arguments4,
      ]);
      await require("./taskcallback").doTask(request, {
        ...options,
        params,
        jar,
      });

      let s = Math.floor(Math.random() * 20);
      console.log("☕ 等待%s秒再继续", s);
      // eslint-disable-next-line no-unused-vars
      await new Promise((resolve, reject) => setTimeout(resolve, s * 1000));
    } while (--num);
  },
};

module.exports = threeSquirrels;
