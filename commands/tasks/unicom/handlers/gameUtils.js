let AES = require("./PAES");
let { useragent } = require("./myPhone");
let gameEvents = require("./dailyEvent");

let transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data["" + item + ""]);
  }
  return params;
};
let sleep = async (seconds) => {
  console.log(`☕ 等待${seconds}秒再继续`);
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

/**
 * 加密用户电话号码
 * @param {string} phone 明文电话号码
 */
let encodePhone = (phone) => {
  return AES.encryptPhone(phone, "gb6YCccUvth75Tm2");
};
/**
 * 各平台游戏请求封装
 */
const Referer_msmds = `https://wxapp.msmds.cn/`;
const Origin_msmds = `https://wxapp.msmds.cn/`;
class UnicomRequest {
  axios;
  options;
  constructor(axios, options) {
    this.axios = axios;
    this.options = options;
  }
  async postMsmds(
    url,
    data,
    headers = { referer: null, origin: null },
    USER_AGENTS = null
  ) {
    return await this.axios.request({
      headers: {
        "user-agent": USER_AGENTS ? USER_AGENTS : useragent(this.options),
        referer: headers.referer ? headers.referer : Referer_msmds,
        origin: headers.origin ? headers.origin : Origin_msmds,
      },
      url,
      method: "POST",
      data: transParams(data),
    });
  }
  async getMsmds(
    url,
    data,
    headers = { referer: null, origin: null },
    USER_AGENTS = null
  ) {
    return await this.axios.request({
      // baseURL: "https://m.client.10010.com/",
      headers: {
        "user-agent": USER_AGENTS ? USER_AGENTS : useragent(this.options),
        referer: headers.referer ? headers.referer : Referer_msmds,
        origin: headers.origin ? headers.origin : Origin_msmds,
      },
      url,
      method: "GET",
      params: transParams(data),
    });
  }
}
/**
 * 针对通用活动业务封装后得组件库
 */
class UnicomComponent {
  axios;
  options;
  UA;
  phone;
  task;
  constructor(axios, options, taskname, platform = "") {
    this.axios = axios;
    this.options = options;
    this.phone = encodePhone(options.user);
    this.UA = useragent(options);
    this.platform = platform;
    this.taskname = taskname;
  }
  async do(title, callback = function () {}) {
    return async () => {
      task[title] = callback();
    };
  }
  async login(url) {
    return gameEvents.getOpenPlatLine(
      url.indexOf("openPlatLine.htm") > -1
        ? url
        : `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=${url}`,
      { base: this.platform }
    );
  }
}

module.exports = {
  transParams,
  sleep,
  encodePhone,
  UnicomRequest,
};

//OLD=>NEW
// eslint-disable-next-line no-unused-vars
