const path = require("path");
const tasklist = require("../utils/observersion");
const { scheduler } = require("../utils/scheduler");

exports.command = "unicom";

exports.describe = "unicom任务";
const UNICOM_USERNAME = "UNICOM_USERNAME";
const UNICOM_PASSWORD = "UNICOM_PASSWORD";
const UNICOM_APPID = "UNICOM_APPID";
String.prototype.replaceWithMask = function (start, end) {
  return this.substr(0, start) + "******" + this.substr(-end, end);
};
let env = require("dotenv").config({
  path: path.resolve(__dirname, "../config", ".env"),
}).parsed;
if (!env) {
  throw new Error("missing env file,please check it as well");
}
exports.builder = function (yargs) {
  return yargs
    .option("leftTasks", {
      describe: "剩余任务统计",
      type: "boolean",
    })
    .option("tasks", {
      describe: "任务执行项",
      type: "string",
    })
    .help()
    .showHelpOnFail(true, "使用--help查看有效选项")
    .epilog("copyright 2020 LunnLew");
};

let getAccount = (data, cb = null) => {
  let account = [];
  let users = data[UNICOM_USERNAME].split(",").map((i) => i.trim());
  let pwd = data[UNICOM_PASSWORD].split(",").map((i) => i.trim());
  let appid = data[UNICOM_APPID].split(",").map((i) => i.trim());
  if (!users.length || !pwd.length || users.length !== pwd.length) {
    throw new Error("Please check your usernames and passwords in env file");
  }
  if (
    Object.prototype.toString.call(users) !== "[object Array]" &&
    Object.prototype.toString.call(pwd) !== "[object Array]"
  ) {
    throw new Error("usernames and passwords are illegal");
  }
  users.forEach((user, i) => {
    account.push({ user: user, password: pwd[i], appid: appid[i] });
  });
  return typeof cb === "function" ? cb(account) : account;
};
exports.handler = async function (argv) {
  var command = argv._[0];
  var accounts = [];
  accounts = getAccount(env, (data) => {
    data.map((i) => {
      if ("tasks" in argv) i.tasks = argv["tasks"];
    });
    return data;
  });
  console.log("总账户数", accounts.length);
  for (let account of accounts) {
    if ("leftTasks" in argv) {
      let tmp = tasklist
        .getTasks({ command: command, taskKey: account.user })
        .unfinished()
        .toString();
      console.log(`账号${account.user.replaceWithMask(2, 3)}未完成任务汇总: `);
      console.log(tmp);
    } else {
      await require(path.join(__dirname, "tasks", command, command))
        .start({
          cookies: account.cookies,
          options: {
            appid: account.appid,
            user: account.user,
            password: account.password,
          },
        })
        .catch((err) => console.log(" unicom任务:", err));
      let hasTasks = await scheduler.hasWillTask(command, {
        tryrun: "tryrun" in argv,
        taskKey: account.user,
      });
      if (hasTasks) {
        scheduler
          .execTask(command, account.tasks)
          .catch((err) => console.log("unicom任务:", err))
          .finally(() => {
            console.log("当前任务执行完毕！");
          });
      } else {
        console.log("暂无可执行任务！");
      }
    }
  }
};
