let crypto = require("crypto");
let moment = require("moment");
let { encryptPhone, sign, encrypt } = require("./handlers/PAES.js");
const { useragent, randomNumber } = require("./handlers/myPhone");
const gameEvents = require("./handlers/dailyEvent");
let { transParams } = require("./handlers/gameUtils");
const appList = [
  {
    mMainTitle: "线上桌游吧，随时随地玩桌游",
    mSubTitle: "会玩",
    mPkgName: "com.wepie.weplay",
  },
];

let Data = {
  commonInfo: {
    traceId: "10000820210212012126257215774155",
    currentTime: "20210212012126257",
    channelCode: "100008",
  },
  params: {
    serialNumber: "",
    appList: [],
    operator: "onAdClick",
  },
  methodType: "2",
};

let freeDownFloorAd = {
  doTask: async (axios, options) => {
    // 10000820210212140437577215167304
    //"10000820210212155412093 215210247",
    // "20210212155412093",
    let currentTime = moment().format("YYYYMMDDHHmmssSSS");
    let traceId = "100008" + currentTime + "215210247";
    Data.commonInfo.traceId = traceId;
    Data.commonInfo.currentTime = currentTime;
    Data.params.serialNumber = options.user;
    Data.params.appList.push(appList[0]);
    let jar1 = await freeDownFloorAd.onAdDisplay(axios, options, Data);
    await freeDownFloorAd.onAdClick(axios, options, Data);
    await freeDownFloorAd.findAll(axios, options);
    await freeDownFloorAd.onAdAppDownloadStart(axios, options, Data);
    await freeDownFloorAd.onAdAppDownloadSucceed(axios, options, Data);
    await freeDownFloorAd.onAdAppInstall(axios, options, Data);
    await freeDownFloorAd.onAdAppActive(axios, options, Data);
    await freeDownFloorAd.getIntegralFree(axios, options, jar1);
    await freeDownFloorAd.onAdDisplay(axios, options, Data);
  },
  onAdDisplay: async (axios, options, appinfo) => {
    let currentTime = moment().format("YYYYMMDDHHmmssSSS");
    let traceId = "100008" + currentTime + "215210247";
    appinfo.commonInfo.traceId = traceId;
    appinfo.commonInfo.currentTime = currentTime;
    appinfo.params.operator = "onAdDisplay";
    let res = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": "okhttp/4.4.0",
          origin: "https://m.client.10010.com/",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/uniAdmsInterface/getFreeDownFloorAd`,
        method: "post",
        data: appinfo,
      })
      .catch((err) => console.log(err));
    let jar1 = res.config.jar.toJSON();
    jar1.cookies.push({
      key: "req_wheel",
      value: "ssss",
      expires: "2021-02-13T09:43:35.000Z",
      domain: "10010.com",
      path: "/",
      hostOnly: false,
      creation: "2021-02-12T08:43:35.008Z",
      lastAccessed: "2021-02-12T08:43:35.008Z",
    });
    console.log(res.data);
    console.log("等待15秒再继续");
    // eslint-disable-next-line no-unused-vars
    await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000));
    return jar1;
  },
  findAll: async (axios, options) => {
    let res = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": "okhttp/4.4.0",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/mobileService/downloads/findAll.htm`,
        method: "post",
      })
      .catch((err) => console.log(err));
    console.log(res.data);
  },
  onAdClick: async (axios, options, appinfo) => {
    let currentTime = moment().format("YYYYMMDDHHmmssSSS");
    let traceId = "100008" + currentTime + "215210247";
    appinfo.commonInfo.traceId = traceId;
    appinfo.commonInfo.currentTime = currentTime;
    appinfo.params.operator = "onAdClick";
    let res = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": "okhttp/4.4.0",
          origin: "https://m.client.10010.com",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/uniAdmsInterface/getFreeDownFloorAd`,
        method: "post",
        data: appinfo,
      })
      .catch((err) => console.log(err));
    console.log(res.data);
    console.log("等待15秒再继续");
    // eslint-disable-next-line no-unused-vars
    await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000));
  },
  onAdAppDownloadStart: async (axios, options, appinfo) => {
    let currentTime = moment().format("YYYYMMDDHHmmssSSS");
    let traceId = "100008" + currentTime + "215210247";
    appinfo.commonInfo.traceId = traceId;
    appinfo.commonInfo.currentTime = currentTime;
    appinfo.params.operator = "onAdAppDownloadStart";
    let res = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": "okhttp/4.4.0",
          origin: "https://m.client.10010.com",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/uniAdmsInterface/getFreeDownFloorAd`,
        method: "post",
        data: appinfo,
      })
      .catch((err) => console.log(err));
    console.log(res.data);
    console.log("等待15秒再继续");
    // eslint-disable-next-line no-unused-vars
    await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000));
  },
  onAdAppDownloadSucceed: async (axios, options, appinfo) => {
    let currentTime = moment().format("YYYYMMDDHHmmssSSS");
    let traceId = "100008" + currentTime + "215210247";
    appinfo.commonInfo.traceId = traceId;
    appinfo.commonInfo.currentTime = currentTime;
    appinfo.params.operator = "onAdAppDownloadSucceed";
    let res = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": "okhttp/4.4.0",
          origin: "https://m.client.10010.com",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/uniAdmsInterface/getFreeDownFloorAd`,
        method: "post",
        data: appinfo,
      })
      .catch((err) => console.log(err));
    console.log(res.data);
    console.log("等待15秒再继续");
    // eslint-disable-next-line no-unused-vars
    await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000));
  },
  onAdAppInstall: async (axios, options, appinfo) => {
    let currentTime = moment().format("YYYYMMDDHHmmssSSS");
    let traceId = "100008" + currentTime + "215210247";
    appinfo.commonInfo.traceId = traceId;
    appinfo.commonInfo.currentTime = currentTime;
    appinfo.params.operator = "onAdAppInstall";
    let res = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": "okhttp/4.4.0",
          origin: "https://m.client.10010.com",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/uniAdmsInterface/getFreeDownFloorAd`,
        method: "post",
        data: appinfo,
      })
      .catch((err) => console.log(err));
    console.log(res.data);
    console.log("等待15秒再继续");
    // eslint-disable-next-line no-unused-vars
    await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000));
  },
  onAdAppActive: async (axios, options, appinfo) => {
    let currentTime = moment().format("YYYYMMDDHHmmssSSS");
    let traceId = "100008" + currentTime + "215210247";
    appinfo.commonInfo.traceId = traceId;
    appinfo.commonInfo.currentTime = currentTime;
    appinfo.params.operator = "onAdAppActive";
    let res = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": "okhttp/4.4.0",
          origin: "https://m.client.10010.com",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `/uniAdmsInterface/getFreeDownFloorAd`,
        method: "post",
        data: appinfo,
      })
      .catch((err) => console.log(err));
    console.log(res.data);
    console.log("等待15秒再继续");
    // eslint-disable-next-line no-unused-vars
    await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000));
  },
  getIntegralFree: async (axios, options, jar) => {
    let res = await axios
      .request({
        headers: {
          "user-agent": useragent(options),
          origin: "https://img.client.10010.com",
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: "req_wheel=ssss;",
        },
        url: `https://act.10010.com/SigninApp/floorData/getIntegralFree`,
        method: "post",
        Referer: `https://img.client.10010.com/SigininApp/index.html?yw_code=&desmobile=${options.user}&version=android@8.0102`,
        "X-Requested-With": "com.sinovatech.unicom.ui",
      })
      .catch((err) => console.log(err));
    console.log(res.data);
  },
};
module.exports = freeDownFloorAd;
