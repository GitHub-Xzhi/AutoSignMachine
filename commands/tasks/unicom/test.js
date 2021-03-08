const { UnicomComponent } = require("./handlers/gameUtils");
// 霸王餐刮刮卡
let testDemo = {
  doTask: async (axios, options) => {
    //配置平台信息参数axios, options必填，3：游戏活动名，4：平台种类
    let test = new UnicomComponent(axios, options, "测试游戏", "msmds");
    await testDemo.login(test);
    let data = await testDemo.getinfo(test);
    console.log(data);
  },
  login: async (request) => {
    return await request.login(
      `https://wxapp.msmds.cn/h5/react_web/unicom/luckCardPage&duanlianjieabc=tbkd2`
    );
  },
  getinfo: async (request) => {
    //请求配置参数
    let requestConfig = {
      url:
        "https://wxapp.msmds.cn/jplus/api/scratchCardRecord/getScratchCardNum",
      body: {
        channelId: "unicom_scratch_card",
        phone: request.getPhone(),
        token: request.getToken(),
      },
      method: "POST",
      headers: {
        referer: `https://wxapp.msmds.cn/`,
        origin: "https://wxapp.msmds.cn",
      },
    };
    return await request.getinfo(requestConfig, (result) => {
      console.log(result.data);
      return {
        freeTimes: result.data.data.surplusNum,
        advertTimes: result.data.data.canLookVideo
          ? 4 - result.data.data.playNum
          : 0,
      };
    });
  },
};

module.exports = testDemo;
