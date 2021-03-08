const {
  UnicomRequest,
  generateOrderid,
  sleep,
  encodePhone,
} = require("./handlers/gameUtils");
const gameEvents = require("./handlers/dailyEvent");
const { sign } = require("./handlers/PAES");

let dailyTurncards = {
  getOpenPlatLine: gameEvents.getOpenPlatLine(
    `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/luckCardPage&duanlianjieabc=tbkd2`,
    { base: "msmds" }
  ),
  doTask: async (axios, options) => {
    console.log("🤔  美团饿了么外卖开始...");
    let phone = encodePhone(options.user);
    let cookies = await dailyTurncards.getOpenPlatLine(axios, options);
    await dailyTurncards.findUserTaskInfo(axios, options, {
      ...cookies,
      phone,
    });
    //todo：判定40积分? 没找到API
    try {
      await dailyTurncards.doElementTask(axios, options, {
        ...cookies,
        phone,
      });
      await dailyTurncards.doMeituanTask(axios, options, {
        ...cookies,
        phone,
      });
    } catch (err) {
      console.log(err);
    }
  },
  doMeituanTask: async (axios, options, { ecs_token, jar1, phone }) => {
    let request = new UnicomRequest(axios, options);
    console.log("美团积分开始...");
    let result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomComm/updateRecordOperation",
      {
        key: "welfare1",
        phone: options.user,
        value: 1,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    console.log("获取操作");
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomComm/getRecordOperation",
      {
        key: "welfare0",
        phone: options.user,
        value: 0,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomComm/getRecordOperation",
      {
        key: "welfare1",
        phone: options.user,
        value: 0,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    console.log("获取信息");
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomTask/findUserTaskInfo",
      {
        phone: phone,
        type: 1,
        token: ecs_token,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );

    // console.log(result.data);
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    console.log("奖励开始");
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomTask/doTask",
      {
        phone: phone,
        type: 6,
        token: ecs_token,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );

    // console.log(result.data);
    if (result.data.code !== 200) {
      if (result.data.code === 502) {
        console.log("后台检测到非法请求，需要验证码。");
        return;
      }
      throw new Error("❌ something errors: ", result.data.msg);
    }

    console.log("开优惠券");
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomTask/receiveDouling",
      {
        type: 6,
        phone: phone,
        token: ecs_token,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      console.log("❌ something errors: ", result.data.msg);
    }
    console.log(result.data);
    let meituanParams = {
      arguments1: "AC20200716103629",
      arguments2: "GGPD",
      arguments3: "90d46c26212649788ed1dd14134d35e5",
      arguments4: new Date().getTime(),
      arguments6: "517050707",
      netWay: "Wifi",
      version: `android@8.0102`,
    };
    meituanParams["sign"] = sign([
      meituanParams.arguments1,
      meituanParams.arguments2,
      meituanParams.arguments3,
      meituanParams.arguments4,
    ]);
    let { num, jar } = await require("./taskcallback").query(axios, {
      ...options,
      params: meituanParams,
    });

    if (num) {
      console.log("美团积分获取开始...");
      let params = {
        arguments1: "AC20200716103629", // acid
        arguments2: "GGPD", // yhChannel
        arguments3: "90d46c26212649788ed1dd14134d35e5", // yhTaskId menuId
        arguments4: new Date().getTime(), // time
        arguments6: "517050707",
        arguments7: "517050707",
        arguments8: "123456",
        arguments9: "4640b530b3f7481bb5821c6871854ce5",
        netWay: "Wifi",
        remark1: "领福利赚积分-翻倍得积分",
        remark: "领福利赚积分-翻倍得积分",
        version: `android@8.0102`,
        codeId: 945535612,
      };
      params["sign"] = sign([
        params.arguments1,
        params.arguments2,
        params.arguments3,
        params.arguments4,
      ]);
      params["orderId"] = generateOrderid();
      params["arguments4"] = new Date().getTime();
      console.log("看视频广告中...");
      let result = await require("./taskcallback").reward(axios, {
        ...options,
        params,
        jar: jar1,
      });
      console.log(`广告ID:`, result["orderId"]);
      await sleep(30);
      params = {
        arguments1: "AC20200716103629", // acid
        arguments2: "GGPD", // yhChannel
        arguments3: "90d46c26212649788ed1dd14134d35e5", // yhTaskId menuId
        arguments4: new Date().getTime(), // time
        arguments6: "",
        arguments7: "",
        arguments8: "",
        arguments9: "",
        orderId: params["orderId"],
        netWay: "Wifi",
        remark: "领福利赚积分-翻倍得积分",
        version: `android@8.0102`,
        codeId: 945689604,
      };
      params["sign"] = sign([
        params.arguments1,
        params.arguments2,
        params.arguments3,
        params.arguments4,
      ]);
      await sleep(30);
      await require("./taskcallback").doTask(axios, {
        ...options,
        params,
        jar,
      });
    }
  },
  doElementTask: async (
    axios,
    options,
    // eslint-disable-next-line no-unused-vars
    { ecs_token, searchParams, jar1, phone }
  ) => {
    let request = new UnicomRequest(axios, options);
    console.log("饿了么积分开始...");
    let result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomComm/updateRecordOperation",
      {
        key: "welfare0",
        phone: options.user,
        value: 1,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    console.log("获取操作");
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomComm/getRecordOperation",
      {
        key: "welfare0",
        phone: options.user,
        value: 0,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomComm/getRecordOperation",
      {
        key: "welfare1",
        phone: options.user,
        value: 0,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    console.log("获取信息");
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomTask/findUserTaskInfo",
      {
        phone: phone,
        type: 1,
        token: ecs_token,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );

    // console.log(result.data);
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    console.log("奖励开始");
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomTask/doTask",
      {
        phone: phone,
        type: 1,
        token: ecs_token,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
        "Content-Type": "application/x-www-form-urlencoded",
      }
    );

    // console.log(result.data);
    if (result.data.code !== 200) {
      if (result.data.code === 502) {
        console.log("后台检测到非法请求，需要验证码。");
        return;
      }
      throw new Error("❌ something errors: ", result.data.msg);
    }
    console.log("开优惠券");
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomTask/receiveDouling",
      {
        type: 1,
        phone: phone,
        token: ecs_token,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    // console.log(result.data);
    if (result.data.code !== 200) {
      console.log("❌ something errors: ", result.data.msg);
    }
    console.log("获取信息");
    result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomTask/findUserTaskInfo",
      {
        type: 1,
        phone: phone,
        token: ecs_token,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", result.data.msg);
    }
    // console.log(result.data);
    // return data;
    let eleParams = {
      arguments1: "AC20200716103629",
      arguments2: "GGPD",
      arguments3: "034a70393ef246039264765216450d5d",
      arguments4: new Date().getTime(),
      arguments6: "",
      version: `android@8.0102`,
      netWay: "Wifi",
    };
    eleParams["sign"] = sign([
      eleParams.arguments1,
      eleParams.arguments2,
      eleParams.arguments3,
      eleParams.arguments4,
    ]);
    console.log("查询奖励");
    let { num, jar } = await require("./taskcallback").query(axios, {
      ...options,
      params: eleParams,
    });
    // console.log(num);
    if (num) {
      console.log("饿了么积分获取开始...");
      let params = {
        arguments1: "AC20200716103629", // acid
        arguments2: "GGPD", // yhChannel
        arguments3: "034a70393ef246039264765216450d5d", // yhTaskId menuId
        arguments4: new Date().getTime(), // time
        arguments6: "517050707",
        arguments7: "517050707",
        arguments8: "123456",
        arguments9: "4640b530b3f7481bb5821c6871854ce5",
        netWay: "Wifi",
        remark1: "领福利赚积分-翻倍得积分",
        remark: "领福利赚积分-翻倍得积分",
        version: `android@8.0102`,
        codeId: 945535612,
      };
      params["sign"] = sign([
        params.arguments1,
        params.arguments2,
        params.arguments3,
        params.arguments4,
      ]);
      params["orderId"] = generateOrderid();
      params["arguments4"] = new Date().getTime();
      console.log("看视频广告中...");
      let result = await require("./taskcallback").reward(axios, {
        ...options,
        params,
        jar: jar1,
      });
      console.log(`广告ID:`, result["orderId"]);
      await sleep(30);
      params = {
        arguments1: "AC20200716103629", // acid
        arguments2: "GGPD", // yhChannel
        arguments3: "034a70393ef246039264765216450d5d", // yhTaskId menuId
        arguments4: new Date().getTime(), // time
        arguments6: "",
        arguments7: "",
        arguments8: "",
        arguments9: "",
        orderId: params["orderId"],
        netWay: "Wifi",
        remark: "领福利赚积分-翻倍得积分",
        version: `android@8.0102`,
        codeId: 945689604,
      };
      params["sign"] = sign([
        params.arguments1,
        params.arguments2,
        params.arguments3,
        params.arguments4,
      ]);
      await sleep(30);
      await require("./taskcallback").doTask(axios, {
        ...options,
        params,
        jar,
      });
    }
  },
  findUserTaskInfo: async (
    axios,
    options,
    // eslint-disable-next-line no-unused-vars
    { ecs_token, searchParams, jar1, phone }
  ) => {
    let request = new UnicomRequest(axios, options);
    console.log("查询接口");
    let { data } = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/h5/unicomTask/findUserTaskInfo",
      {
        type: 1,
        phone: phone,
        token: ecs_token,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (data.code !== 200) {
      throw new Error("❌ something errors: ", data.msg);
    }
    console.log("获取优惠券");
    let result = await request.postMsmds(
      "https://wxapp.msmds.cn/jplus/api/elm/eventVenue",
      {
        phone: options.user,
        code: "elm-ltqdzuanjifen",
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", data.msg);
    }
    result = await request.getMsmds(
      `https://wxapp.msmds.cn/jplus/api/byn/getLifeCouponUrlByPhoneV2`,
      {
        type: 3,
        phone: options.user,
      },
      {
        referer: ` https://jxbwlsali.kuaizhan.com/0/51/p721841247bc5ac?phone=${options.user}`,
        origin: "https://jxbwlsali.kuaizhan.com",
      }
    );
    if (result.data.code !== 200) {
      throw new Error("❌ something errors: ", data.msg);
    }
  },
};
module.exports = dailyTurncards;
