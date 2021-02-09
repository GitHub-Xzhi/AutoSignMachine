const useragent = require("./myPhone").useragent;
let AES = require("./PAES");

/**
 * @param {String} url request url absolute path
 */
let getOpenPlatLine = (url, cnf = { base: "" }) => {
  return async (axios, options) => {
    let searchParams = {};
    let result = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": useragent(options),
          referer: `https://img.client.10010.com/`,
          origin: "https://img.client.10010.com",
        },
        url: `${url}`,
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
    let ecs_token = cookiesJson.cookies.find((i) => i.key == "ecs_token");
    if (!ecs_token) {
      throw new Error("ecs_token缺失");
    }
    ecs_token = ecs_token.value;
    let jfid;
    switch (cnf.base) {
      case "msmds":
        console.log("🐱‍🏍 msmds游戏调度");
        return { ecs_token, searchParams, jar1 };
      default:
        console.log("🐱‍🏍 平台游戏调度");
        jfid = cookiesJson.cookies.find((i) => i.key == "_jf_id");
        if (!jfid) {
          throw new Error("jfid缺失");
        }
        jfid = jfid.value;
        return { jfid, searchParams, jar1 };
    }
  };
};

/**
 * @param {String} referer request referer absolute path
 */
let postFreeLoginRock = (referer, freeLoginRockID) => {
  return async (axios, options, { jfid, searchParams, jar1 }) => {
    let params = {
      activityId: freeLoginRockID,
      userCookie: jfid,
      userNumber: searchParams.userNumber,
      time: new Date().getTime(),
    };
    let reqdata = encodeParams(params, false);
    //foods list
    let res = await axios
      .request({
        baseURL: "https://m.jf.10010.com/",
        headers: {
          "user-agent": useragent(options),
          referer: `${referer}`,
          origin: "https://img.jf.10010.com",
          "Content-Type": "application/json",
        },
        jar: jar1,
        url: `/jf-yuech/p/freeLoginRock`,
        method: "post",
        data: reqdata,
      })
      .catch((err) => console.log(err));

    let result = res.data;
    if (result.code !== 0) {
      throw new Error(result.message);
    }

    let activity, Authorization, freeTimes, advertTimes;
    activity = result.data.activityInfos.activityVOs[0]; //available items on the list from request
    Authorization = result.data.token.access_token;
    freeTimes = activity.activityTimesInfo.freeTimes;
    advertTimes = activity.activityTimesInfo.advertTimes;

    return { activity, Authorization, freeTimes, advertTimes };
  };
};

let postFreeLogin = (referer, freeLoginID) => {
  return async (axios, options, { jfid, searchParams, jar1 }) => {
    let params = {
      activityId: freeLoginID,
      userCookie: jfid,
      userNumber: searchParams.userNumber,
      time: new Date().getTime(),
    };

    let reqdata = {
      params: AES.encrypt(JSON.stringify(params), "5de7e29919fad4d5"),
    };
    let res = await axios
      .request({
        baseURL: "https://m.jf.10010.com/",
        headers: {
          "user-agent": useragent(options),
          Authorization: "Bearer null",
          referer,
          origin: "https://img.jf.10010.com",
          "Content-Type": "application/json",
        },
        jar: jar1,
        url: `/jf-yuech/p/freeLogin`,
        method: "post",
        data: reqdata,
      })
      .catch((err) => console.log(err));
    let result = res.data;
    if (result.code !== 0) {
      throw new Error(result.message);
    }
    let activity, Authorization, freeTimes, advertTimes;
    activity = result.data.activity;
    Authorization = result.data.token.access_token;
    freeTimes = activity.freeGameTimes;
    advertTimes = activity.advertLimitNum;
    return { activity, Authorization, freeTimes, advertTimes };
  };
};

let lookVideoDoubleResult = (title) => {
  return async (axios, options) => {
    let { Authorization, activityId, winningRecordId } = options;
    let res = await axios.request({
      headers: {
        Authorization: `Bearer ${Authorization}`,
        "user-agent": useragent(options),
        referer: "https://img.jf.10010.com/",
        origin: "https://img.jf.10010.com",
      },
      url: `https://m.jf.10010.com/jf-yuech/api/gameResult/doublingIntegral?activityId=${activityId}&winningRecordId=${winningRecordId}`,
      method: "get",
    });
    let result = res.data;
    if (result.code !== 0) {
      console.log(`❌ ${title}翻倍结果:`, result.message);
    } else {
      console.log(`⭕ ${title}翻倍结果:`, result.data);
    }
  };
};

/**
 *
 * @param {JSON} p1 提交参数
 * @param {boolean} isNewGame 新游戏更新后的参数方法
 */
let encodeParams = (p1, isNewGame = false) => {
  let n = Math.floor(5 * Math.random());
  if (isNewGame) {
    //join the game
    let i = AES.newjiamarr();
    return {
      params: AES.encrypt(JSON.stringify(p1), i["zfc"]) + n,
      parKey: i["arr"],
    };
  } else {
    let i = AES.secretkeyArray();
    return {
      params: AES.encrypt(JSON.stringify(p1), i[n]) + n,
      parKey: i,
    };
  }
};
module.exports = {
  getOpenPlatLine,
  postFreeLoginRock,
  postFreeLogin,
  lookVideoDoubleResult,
  encodeParams,
};
