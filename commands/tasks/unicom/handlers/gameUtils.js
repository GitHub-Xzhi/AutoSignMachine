let AES = require("./PAES");
let { useragent } = require("./myPhone");
let gameEvents = require("./dailyEvent");
let crypto = require("crypto");

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

let generateOrderid = () => {
  return crypto
    .createHash("md5")
    .update(new Date().getTime() + "")
    .digest("hex");
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
    headers = {
      referer: null,
      origin: null,
    },
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
  async post(
    url,
    data,
    headers = { referer: null, origin: null, Authorization: null },
    USER_AGENTS = null
  ) {
    return await this.axios.request({
      headers: {
        "user-agent": USER_AGENTS ? USER_AGENTS : useragent(this.options),
        referer: headers.referer ? headers.referer : Referer_msmds,
        origin: headers.origin ? headers.origin : Origin_msmds,
        Authorization: headers.Authorization ? headers.Authorization : "",
      },
      url,
      method: "POST",
      data: data,
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
  async get(
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
      params: data,
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
  task = {};
  taskname;
  cookies;
  channelId;
  headers;
  constructor(axios, options, taskname, platform = "", appversion = "8.0102") {
    this.axios = axios;
    this.options = options;
    this.options.appversion = appversion;
    this.phone = encodePhone(this.options.user);
    this.UA = useragent(this.options);
    this.platform = platform;
    this.taskname = taskname;
  }
  /**
   * 业务注册
   * @param {string}} title 业务项目
   * @param {*} callback 回调
   */
  do(title, callback) {
    this.task[title] = callback;
    return this.task[title];
  }
  /**
   * 平台登录入口
   * @param {string} url 登录请求URL
   */
  login(url) {
    this.cookies = gameEvents
      .getOpenPlatLine(
        url.indexOf("openPlatLine.htm") > -1
          ? url
          : `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=${url}`,
        { base: this.platform },
        (cookies) => {
          this.cookies = cookies;
        }
      )
      .call(this, this.axios, this.options);
    // this.do("login", cb);
    return this.cookies;
  }
  postFreeLoginGuess(referer, freeLoginId, cookies = null, callback = null) {
    return gameEvents
      .postFreeLoginGuessWithCallBack(referer, freeLoginId, callback)
      .call(this, this.axios, this.options, cookies);
  }
  // avoidLogin()
  setChannelId(channelId) {
    this.channelId = channelId;
  }
  // async do(title) {
  //   return await this.task[title].call(this, this.axios, this.options);
  // }

  async getinfo(
    data = { url, body, method: "POST", headers: { referer: "", options: "" } },
    callback = null
  ) {
    let { url, body, method, headers } = data;
    return this.do("getinfo", async (axios, options) => {
      let request = new UnicomRequest(axios, options);
      let result;
      if (method === "POST") {
        result = await request.postMsmds(url, body, headers, this.UA);
      } else {
        result = await request.getMsmds(url, body, headers, this.UA);
      }
      if (result.data.code !== 200) {
        throw new Error("❌ something errors: ", result.data.msg);
      }
      if (typeof callback != "function") {
        return result;
      } else {
        return callback(result);
      }
    }).call(this, this.axios, this.options);
  }

  async get(
    data = { url, body, method: "POST", headers: { referer: "", origin: "" } },
    callback = null
  ) {
    let { url, body, method, headers } = data;
    return this.do("getinfo", async (axios, options) => {
      let request = new UnicomRequest(axios, options);
      let result;
      if (method === "POST") {
        result = await request.post(url, body, headers, this.UA);
      } else {
        result = await request.get(url, body, headers, this.UA);
      }
      if (typeof callback == "function") {
        result.data = callback(result.data);
      }
      return result;
    }).call(this, this.axios, this.options);
  }
  getPhoneAsync(encodePhone = true) {
    return () => {
      encodePhone ? this.phone : this.options.user;
    };
  }
  getPhone(encodePhone = true) {
    return encodePhone ? this.phone : this.options.user;
  }
  setHeaders(headers) {
    this.headers = headers;
    return this;
  }
  getToken() {
    let { ecs_token } = this.cookies;
    return ecs_token;
  }
}

module.exports = {
  transParams,
  sleep,
  encodePhone,
  UnicomRequest,
  UnicomComponent,
  generateOrderid,
};

//OLD=>NEW
// eslint-disable-next-line no-unused-vars
