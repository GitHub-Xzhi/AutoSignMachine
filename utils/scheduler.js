const os = require("os");
const path = require("path");
const fs = require("fs-extra");
var moment = require("moment");
moment.locale("zh-cn");
const { getCookies } = require("./util");
const _request = require("./request");
var crypto = require("crypto");
const { default: PQueue } = require("p-queue");

String.prototype.replaceWithMask = function (start, end) {
  return this.substr(0, start) + "******" + this.substr(-end, end);
};

const randomDate = (options) => {
  let startDate = moment();
  let endDate = moment().endOf("days").subtract(5, "hours");
  if (options && options.startHours) {
    startDate = moment().startOf("days").add(options.startHours, "hours");
  }
  if (options && options.endHours) {
    endDate = moment().startOf("days").add(options.endHours, "hours");
  }
  // eslint-disable-next-line prettier/prettier
  return new Date(
    +startDate.toDate() +
      Math.random() * (endDate.toDate() - startDate.toDate())
  );
};
let tasks = {};
let scheduler = {
  taskFile: path.join(os.homedir(), ".AutoSignMachine", "taskFile.json"),
  today: "",
  isRunning: false,
  isTryRun: false,
  taskJson: undefined,
  queues: [],
  will_queues: [],
  taskKey: "default",
  clean: async () => {
    scheduler.today = "";
    scheduler.isRunning = false;
    scheduler.isTryRun = false;
    scheduler.taskJson = undefined;
    scheduler.queues = [];
    scheduler.will_queues = [];
    scheduler.taskKey = "default";
  },
  buildQueues: async () => {
    let queues = [];
    let taskNames = Object.keys(tasks);
    for (let taskName of taskNames) {
      let options = tasks[taskName].options;
      let willTime = moment(randomDate(options));
      let waitTime = options.dev ? 0 : Math.floor(Math.random() * 600);
      if (options) {
        if (options.isCircle || options.dev) {
          willTime = moment().startOf("days");
        }
        if (options.startTime) {
          willTime = moment().startOf("days").add(options.startTime, "seconds");
        }
        if (options.ignoreRelay) {
          waitTime = 0;
        }
      }
      if (scheduler.isTryRun) {
        willTime = moment().startOf("days");
        waitTime = 0;
      }
      queues.push({
        taskName: taskName,
        taskState: 0,
        willTime: willTime.format("YYYY-MM-DD HH:mm:ss"),
        waitTime: waitTime,
      });
    }
    return queues;
  },
  // 初始化待执行的任务队列
  initTasksQueue: async () => {
    const today = moment().format("YYYYMMDD");
    if (!fs.existsSync(scheduler.taskFile)) {
      console.log("📑 任务配置文件不存在，创建配置中");
      let queues = await scheduler.buildQueues();
      fs.createFileSync(scheduler.taskFile);
      fs.writeFileSync(
        scheduler.taskFile,
        JSON.stringify({
          today,
          queues,
        })
      );
      console.log("📑 任务配置文件创建完毕 等待5秒再继续");
      // eslint-disable-next-line no-unused-vars
      await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000));
    } else {
      let taskJson = fs.readFileSync(scheduler.taskFile).toString("utf-8");
      taskJson = JSON.parse(taskJson);
      if (taskJson.today !== today) {
        console.log("📑  日期已变更，重新生成任务配置");
        let queues = await scheduler.buildQueues();
        fs.writeFileSync(
          scheduler.taskFile,
          JSON.stringify({
            today,
            queues,
          })
        );
        console.log("📑 任务配置文件更新完毕 等待5秒再继续");
        // eslint-disable-next-line no-unused-vars
        await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000));
      }

      if (taskJson.queues.length !== Object.keys(tasks).length) {
        console.log("📑 数量已变更，重新生成任务配置");
        let queues = await scheduler.buildQueues();
        fs.writeFileSync(
          scheduler.taskFile,
          JSON.stringify({
            today,
            queues,
          })
        );
        console.log("📑 任务配置文件更新完毕 等待5秒再继续");
        // eslint-disable-next-line no-unused-vars
        await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000));
      }
    }
    scheduler.today = today;
  },
  genFileName(command) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      let dir = path.join(os.homedir(), ".AutoSignMachine");
      if (
        "TENCENTCLOUD_RUNENV" in process.env &&
        process.env.TENCENTCLOUD_RUNENV === "SCF"
      ) {
        dir = path.join("/tmp", ".AutoSignMachine");
        // 暂不支持持久化配置，使用一次性执行机制，函数超时时间受functions.timeout影响
        scheduler.isTryRun = true;
      }
      if (!fs.existsSync(dir)) {
        fs.mkdirpSync(dir);
      }
      scheduler.taskFile = path.join(
        dir,
        `taskFile_${command}_${scheduler.taskKey}.json`
      );
      let maskFile = path.join(
        dir,
        `taskFile_${command}_${scheduler.taskKey.replaceWithMask(2, 3)}.json`
      );
      scheduler.today = moment().format("YYYYMMDD");
      console.log("获得配置文件", maskFile, "当前日期", scheduler.today);
      resolve();
    });
  },
  loadTasksQueue: async () => {
    let queues = [];
    let will_queues = [];
    let taskJson = {};
    if (fs.existsSync(scheduler.taskFile)) {
      taskJson = fs.readFileSync(scheduler.taskFile).toString("utf-8");
      console.log("📑 任务配置文件读取完毕 等待5秒再继续");
      // eslint-disable-next-line no-unused-vars
      await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000));
      taskJson = JSON.parse(taskJson);
      if (taskJson.today === scheduler.today) {
        queues = taskJson.queues;
      }
      if (scheduler.isTryRun) {
        fs.unlinkSync(scheduler.taskFile);
      }
    }
    for (let task of queues) {
      if (
        task.taskState === 0 &&
        moment(task.willTime).isBefore(moment(), "minutes")
      ) {
        will_queues.push(task);
      }
    }
    scheduler.taskJson = taskJson;
    scheduler.queues = queues;
    scheduler.will_queues = will_queues;
    return {
      taskJson,
      queues,
      will_queues,
    };
  },
  regTask: async (taskName, callback, options) => {
    tasks[taskName] = {
      callback,
      options,
    };
  },
  hasWillTask: async (command, params) => {
    const { taskKey, tryrun } = params;
    scheduler.clean();
    scheduler.isTryRun = tryrun;
    scheduler.taskKey = taskKey || "default";
    console.log(
      "将使用",
      scheduler.taskKey.replaceWithMask(2, 3),
      "作为账户识别码"
    );
    console.log("🤨 计算可执行任务...");
    if (scheduler.isTryRun) {
      console.log("👉 当前运行在TryRun模式，仅建议在测试时运行!");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return 1;
      // return 1;
    } else {
      await scheduler.genFileName(command);
      await scheduler.initTasksQueue();
      let { will_queues } = await scheduler.loadTasksQueue();
      scheduler.isRunning = true;
      return will_queues.length;
    }
  },
  //生成任务队列文件并且初始化队列数据
  fetchTasks: async (command) => {
    if (!scheduler.isRunning && !scheduler.isTryRun) {
      await scheduler.genFileName(command);
      await scheduler.initTasksQueue();
    }
  },
  //状态码 0x1 tryrun模式 0x2 队列模式
  // eslint-disable-next-line no-unused-vars
  getTaskStatus: (command) => {
    if (scheduler.isTryRun) return 0x1;
    return 0x2;
  },
  execTask: async (command, selectedTasks) => {
    console.log("🤨 开始执行任务");
    if (process.env.GITHUB_ACTIONS) {
      return;
    }
    await scheduler.fetchTasks(command);
    if (Object.prototype.toString.call(selectedTasks) == "[object String]") {
      selectedTasks = selectedTasks.split(",").filter((q) => q);
    } else {
      selectedTasks = [];
    }
    if (selectedTasks.length) {
      console.log("👉 将只执行选择的任务", selectedTasks.join(","));
    }
    let { taskJson, queues, will_queues } = scheduler;

    let will_tasks = will_queues.filter(
      (task) =>
        task.taskName in tasks &&
        (!selectedTasks.length ||
          (selectedTasks.length && selectedTasks.indexOf(task.taskName) !== -1))
    );

    switch (scheduler.getTaskStatus()) {
      case 1: {
        console.log(`👇 获取总任务数: ${selectedTasks.length}`);
        let currentTasks = [];
        selectedTasks.forEach((v) => {
          if (
            tasks[v] !== undefined &&
            Object.prototype.toString.call(tasks[v]) == "[object Object]"
          ) {
            currentTasks.push({ taskName: v, task: tasks[v] });
          }
        });
        let { init_funcs_result } = await scheduler.pushTaskQueue(
          command,
          currentTasks
        );
        console.log("tryrun 任务模式启动");
        if (!currentTasks.length) return console.log("无任务");
        let queue = new PQueue({ concurrency: 2 });
        console.log("👉 调度任务中", "并发数", 2);
        for (let task of currentTasks) {
          queue.add(async () => {
            try {
              let ttt = tasks[task.taskName];
              if (
                Object.prototype.toString.call(ttt.callback) ===
                "[object AsyncFunction]"
              ) {
                await ttt.callback.apply(
                  this,
                  Object.values(init_funcs_result[task.taskName + "_init"])
                );
              } else {
                console.log("❌ 任务执行内容空");
              }

              let isupdate = false;
              let newTask = {};
              if (ttt.options) {
                if (!ttt.options.isCircle) {
                  newTask.taskState = 1;
                  isupdate = true;
                }
                if (ttt.options.isCircle && ttt.options.intervalTime) {
                  newTask.willTime = moment()
                    .add(ttt.options.intervalTime, "seconds")
                    .format("YYYY-MM-DD HH:mm:ss");
                  isupdate = true;
                }
              } else {
                newTask.taskState = 1;
                isupdate = true;
              }

              if (isupdate && !scheduler.isTryRun) {
                let taskindex = queues.findIndex(
                  (q) => q.taskName === task.taskName
                );
                if (taskindex !== -1) {
                  taskJson.queues[taskindex] = {
                    ...task,
                    ...newTask,
                  };
                }
                console.log("📑 任务执行完毕 等待5秒再继续");
                // eslint-disable-next-line no-unused-vars
                await new Promise((resolve, reject) =>
                  setTimeout(resolve, 5 * 1000)
                );
              }
            } catch (err) {
              console.log("❌ 任务错误：", err);
            }
          });
        }
        await queue.onIdle();
        break;
      }
      case 2:
        console.log(
          `👇 获取总任务数${taskJson.queues.length}，已完成任务数${
            queues.filter((q) => q.taskState === 1).length
          }，截至当前可执行任务数${will_tasks.length}`
        );
        if (will_tasks.length) {
          let init_funcs = {};
          let init_funcs_result = {};
          for (let task of will_tasks) {
            let ttt = tasks[task.taskName];
            let tttOptions = ttt.options || {};
            let savedCookies =
              getCookies([command, scheduler.taskKey].join("_")) ||
              tttOptions.cookies;
            let request = _request(savedCookies);

            if (tttOptions.init) {
              if (
                Object.prototype.toString.call(tttOptions.init) ===
                "[object AsyncFunction]"
              ) {
                let hash = crypto
                  .createHash("md5")
                  .update(tttOptions.init.toString())
                  .digest("hex");
                if (!(hash in init_funcs)) {
                  init_funcs_result[task.taskName + "_init"] = await tttOptions[
                    "init"
                  ](request, savedCookies);
                  init_funcs[hash] = task.taskName + "_init";
                } else {
                  init_funcs_result[task.taskName + "_init"] =
                    init_funcs_result[init_funcs[hash]];
                }
              } else {
                console.log("not apply");
              }
            } else {
              init_funcs_result[task.taskName + "_init"] = { request };
            }
          }

          // 任务执行
          let queue = new PQueue({ concurrency: 2 });
          console.log("👉 调度任务中", "并发数", 2);
          for (let task of will_tasks) {
            queue.add(async () => {
              try {
                if (task.waitTime) {
                  console.log(
                    "☕ 延迟执行",
                    task.taskName,
                    task.waitTime,
                    "seconds"
                  );
                  // eslint-disable-next-line no-unused-vars
                  await new Promise((resolve, reject) =>
                    setTimeout(resolve, task.waitTime * 1000)
                  );
                }

                let ttt = tasks[task.taskName];
                if (
                  Object.prototype.toString.call(ttt.callback) ===
                  "[object AsyncFunction]"
                ) {
                  await ttt.callback.apply(
                    this,
                    Object.values(init_funcs_result[task.taskName + "_init"])
                  );
                } else {
                  console.log("❌ 任务执行内容空");
                }

                let isupdate = false;
                let newTask = {};
                if (ttt.options) {
                  if (!ttt.options.isCircle) {
                    newTask.taskState = 1;
                    isupdate = true;
                  }
                  if (ttt.options.isCircle && ttt.options.intervalTime) {
                    newTask.willTime = moment()
                      .add(ttt.options.intervalTime, "seconds")
                      .format("YYYY-MM-DD HH:mm:ss");
                    isupdate = true;
                  }
                } else {
                  newTask.taskState = 1;
                  isupdate = true;
                }

                if (isupdate && !scheduler.isTryRun) {
                  let taskindex = queues.findIndex(
                    (q) => q.taskName === task.taskName
                  );
                  if (taskindex !== -1) {
                    taskJson.queues[taskindex] = {
                      ...task,
                      ...newTask,
                    };
                  }
                  fs.writeFileSync(
                    scheduler.taskFile,
                    JSON.stringify(taskJson)
                  );
                  console.log("📑 任务配置文件更新完毕 等待5秒再继续");
                  // eslint-disable-next-line no-unused-vars
                  await new Promise((resolve, reject) =>
                    setTimeout(resolve, 5 * 1000)
                  );
                }
              } catch (err) {
                console.log("❌ 任务错误：", err);
              }
            });
          }
          await queue.onIdle();
        } else {
          console.log(
            `👇 获取总任务数${taskJson.queues.length}，已完成任务数${
              queues.filter((q) => q.taskState === 1).length
            }，截至当前可执行任务数${will_tasks.length}`
          );
        }
        break;
      default:
        console.log("⭕ 暂无需要执行的任务");
    }
  },
  pushTaskQueue: async (command, selectedTasks) => {
    let init_funcs = {};
    let init_funcs_result = {};
    for (let task of selectedTasks) {
      let ttt = tasks[task.taskName];
      let tttOptions = ttt.options || {};
      let savedCookies =
        getCookies([command, scheduler.taskKey].join("_")) ||
        tttOptions.cookies;
      let request = _request(savedCookies);

      if (tttOptions.init) {
        if (
          Object.prototype.toString.call(tttOptions.init) ===
          "[object AsyncFunction]"
        ) {
          let hash = crypto
            .createHash("md5")
            .update(tttOptions.init.toString())
            .digest("hex");
          if (!(hash in init_funcs)) {
            init_funcs_result[task.taskName + "_init"] = await tttOptions[
              "init"
            ](request, savedCookies);
            init_funcs[hash] = task.taskName + "_init";
          } else {
            init_funcs_result[task.taskName + "_init"] =
              init_funcs_result[init_funcs[hash]];
          }
        } else {
          console.log("not apply");
        }
      } else {
        init_funcs_result[task.taskName + "_init"] = { request };
      }
    }
    return { init_funcs_result, init_funcs };
  },
};
module.exports = {
  scheduler,
};
