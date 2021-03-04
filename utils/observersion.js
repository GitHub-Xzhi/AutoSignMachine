let path = require("path");
const os = require("os");
const fs = require("fs");
let observersion = {
  observable: true,
  directory: path.join(os.homedir(), ".AutoSignMachine"),
  tasks: null,
  unfinishedTask: null,
  getTasks: ({ taskKey, command }) => {
    let taskFile = path.join(
      observersion.directory,
      `taskFile_${command}_${taskKey}.json`
    );
    if (fs.existsSync(taskFile)) {
      let tasks = fs.readFileSync(taskFile).toString("utf-8");
      observersion.tasks = JSON.parse(tasks);
    }
    return observersion;
  },
  unfinished: () => {
    if (!observersion.tasks) {
      throw new Error("No tasks");
    }
    observersion.tasks = observersion.tasks.queues.filter((v) => {
      if (v.taskState === 0) {
        return v;
      }
    });
    return observersion;
  },
  toString: () => {
    let tmpArray = [];
    observersion.tasks.forEach((v) => {
      tmpArray.push(v.taskName);
    });
    return tmpArray.join(",");
  },
  toJson: () => {
    return observersion.tasks;
  },
};

module.exports = observersion;
