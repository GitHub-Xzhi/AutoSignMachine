const { UnicomComponent, transParams } = require("./handlers/gameUtils");
const moment = require("moment");
moment.locale("zh-cn");
let fetchCoins = {
  doTask: async (axios, options) => {
    let request = new UnicomComponent(axios, options, "积分查询");
    let { data } = await request.get({
      url:
        "https://m.client.10010.com/welfare-mall-front/mobile/show/flDetail/v1/0",
      body: transParams({
        reqtime: new Date().getTime(),
        cliver: "",
        reqdata: "{}",
      }),
      method: "POST",
      headers: {
        origin: `https://img.client.10010.com`,
        referer: `https://img.client.10010.com/jifenshangcheng/jifen?loginType=0&scopeType=fl`,
      },
    });
    if (data.code !== "0") {
      console.log("查询出错: ", data.msg);
      return;
    }
    let availablescore = data.resdata.score.availablescore;
    let startDate = moment().startOf("days");
    let consumeCoins = 0;
    let awardCoins = 0;
    data.resdata.detail.forEach((v) => {
      if (startDate.isBefore(v.createTime))
        if (v.books_oper_type === "1") {
          consumeCoins += v.books_number;
        } else {
          awardCoins += v.books_number;
        }
    });
    console.log("💰 今日积分获得:", awardCoins);
    console.log("💰 今日积分消费:", consumeCoins);
    console.log("💰 当前积分合计:", availablescore);
  },
};
module.exports = fetchCoins;
