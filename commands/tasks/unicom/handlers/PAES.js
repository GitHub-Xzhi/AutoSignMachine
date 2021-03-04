/**
 * 预处理AES算法集
 *
 */

let crypto = require("crypto");
let CryptoJS = require("crypto-js");

let sign = (data) => {
  let str = "integralofficial&";
  let params = [];
  data.forEach((v, i) => {
    if (v) {
      params.push("arguments" + (i + 1) + v);
    }
  });
  return crypto
    .createHash("md5")
    .update(str + params.join("&"))
    .digest("hex");
};
// prettier-ignore
const charset = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E",
"F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
"Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q",
"r", "s", "t", "u", "v", "w", "x", "y", "z"];

let secretkeyArray = () => {
  for (var e = [], i = 0x0; 0x05 > i; i++) {
    for (var n = "", s = 0x0; 0x10 > s; s++) {
      let a = Math.floor(0x3e * Math.random());
      n += charset[a];
    }
    e.push(n);
  }
  return e;
};

let encrypt = function (word, keyStr) {
  let key = CryptoJS.enc.Utf8.parse(keyStr);
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

let decrypt = function (word, keyStr) {
  let key = CryptoJS.enc.Utf8.parse(keyStr);
  let decrypted = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

let encryptPhone = (data, key) => {
  var iv = "";
  var cipherEncoding = "base64";
  var cipher = crypto.createCipheriv("aes-128-ecb", key, iv);
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString(
    cipherEncoding
  );
};
let newjiamarr = () => {
  for (var e = [], k = "", t = charset, i = 0x0; 0x4 > i; i++) {
    for (var n = "", s = 0x0; 0x10 > s; s++) {
      let a = Math.floor(0x3e * Math.random());
      n += t[a];
    }
    e.push(n), (k += n.substring(0x0, 0x4));
  }
  return {
    arr: e,
    zfc: k,
  };
};
module.exports = {
  secretkeyArray,
  encrypt,
  decrypt,
  newjiamarr,
  sign,
  encryptPhone,
};
