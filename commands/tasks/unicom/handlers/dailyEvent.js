const useragent = require("./myPhone").useragent;
let AES = require("./handlers/PAES");

/**
 * @param {String} url request url absolute path
 */
let getOpenPlatLine = (url) => {
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
    let jfid = cookiesJson.cookies.find((i) => i.key == "_jf_id");
    if (!jfid) {
      throw new Error("jfid缺失");
    }
    jfid = jfid.value;
    return { jfid, searchParams, jar1 };
  };
};

/**
 * @param {String} referer request referer absolute path
 */
let postFreeLoginRock = (referer) => {
  return async (axios, options, { jfid, searchParams, jar1 }) => {
    let keyArr = AES.secretkeyArray();
    let keyrdm = Math.floor(Math.random() * 5);
    let params = {
      activityId: "Ac-yccnk",
      userCookie: jfid,
      userNumber: searchParams.userNumber,
      time: new Date().getTime(),
    };
    let reqdata = {
      params: AES.encrypt(JSON.stringify(params), keyArr[keyrdm]) + keyrdm,
      parKey: keyArr,
    };
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

    result = res.data;
    if (result.code !== 0) {
      throw new Error(result.message);
    }
    let activity = result.data.activityInfos.activityVOs[0]; //available items on the list from request
    let Authorization = result.data.token.access_token;
    let freeTimes = activity.activityTimesInfo.freeTimes;
    let advertTimes = activity.activityTimesInfo.advertTimes;
    return { activity, Authorization, freeTimes, advertTimes };
  };
};
module.exports = {
  getOpenPlatLine,
  postFreeLoginRock,
};
