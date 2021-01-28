'use strict';

// see https://github.com/serverless/serverless/blob/master/README_CN.md#how-to-install-a-service

exports.main_handler = (event, context, callback) => {
  let argv = process.argv
  argv[2] = process.env.cmd
  argv[3] = '--config'
  argv[4] = process.env.USER_CODE_ROOT + '/' + process.env.config
  argv[5] = '--tasks'
  argv[6] = process.env.tasks
  console.log(argv.join(' '))
  if (!process.env.tasks) {
    callback(null, '必须单独指定任务');
  } else {
    require('./AutoSignMachine.js').run(argv)
    callback(null, '触发任务执行成功');
  }
};
