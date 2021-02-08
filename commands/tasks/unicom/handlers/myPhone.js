const useragent = (options) =>
  `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0102,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`;
//   `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36;devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:};unicom{version:android@8.0102,desmobile:${options.user}}`;
const USER_AGENTS = [];

function randomNumber(min = 0, max = 100) {
  return Math.min(Math.floor(min + Math.random() * (max - min)), max);
}

//pick a random user-agent
const USER_AGENT = USER_AGENTS[randomNumber(0, USER_AGENTS.length)];

module.exports = {
  useragent,
};
