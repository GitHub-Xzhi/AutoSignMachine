let crypto = require("crypto");
let moment = require("moment");
let { encryptPhone } = require("./handlers/PAES.js");
const useragent = require("./handlers/myPhone").useragent;
const gameEvents = require("./handlers/dailyEvent");
let { transParams } = require("./handlers/gameUtils");
const referer =
  "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/yuech-qd/bcow/index.html?jump=sign";
let ingotsPage = {
  doTask: async (axios, options) => {
    let { ecs_token } = await ingotsPage.getOpenPlatLine(axios, options);
    await ingotsPage.postIndexInfo(axios, {
      ...options,
      ecs_token,
    });
  },
  postIndexInfo: async (axios, options) => {
    let phone = encryptPhone(options.user, "gb6YCccUvth75Tm2");
    let result = await axios.request({
      headers: {
        "user-agent": useragent(options),
        referer: `https://wxapp.msmds.cn/`,
        origin: "https://wxapp.msmds.cn",
      },
      url: `https://wxapp.msmds.cn/jplus/h5/greetGoldIngot/IndexInfo`,
      method: "POST",
      data: transParams({
        channelId: "LT_channel",
        phone: phone,
        token: options.ecs_token,
        sourceCode: "lt_ingots",
      }),
    });
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    next(result.data.data);
    function next(data) {
      console.log(
        "😒 聚宝盆签到:" + (data["signTimes"] === 1 ? "已签到" : "未签到")
      );
    }
  },
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/ingotsPage?source=unicom&duanlianjieabc=tbLm0`,
    {
      base: "msmds",
    }
  ),
};

module.exports = ingotsPage;
