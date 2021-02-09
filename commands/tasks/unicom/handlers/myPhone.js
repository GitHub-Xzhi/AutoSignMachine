const util = require("util");

/**
 * pick a random user-agent
 * @param {object} options must be included appversion and user
 */
const useragent = (options) => {
  return util.format(
    USER_AGENTS[randomNumber(0, USER_AGENTS.length)],
    options.appversion || "8.0102",
    options.user
  );
};
//   `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36;devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:};unicom{version:android@8.0102,desmobile:${options.user}}`;
const USER_AGENTS = [
  "Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@%s,desmobile:%s;devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148   unicom{version:iphone_c@%s,desmobile:%s}{systemVersion:dis}{yw_code:}",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 12_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 unicom{version:iphone_c@%s,desmobile:%s}{systemVersion:dis}{yw_code:}",
];

function randomNumber(min = 0, max = 100) {
  return Math.min(Math.floor(min + Math.random() * (max - min)), max);
}

module.exports = {
  useragent,
  randomNumber,
};
