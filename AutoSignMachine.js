const yargs = require('yargs/yargs')
// const { hideBin } = require('yargs/helpers')
/**
 * 命令执行入口
 */
var AutoSignMachine_Run = (argv) => {
  yargs((argv || process.argv).slice(2))
    .commandDir('commands')
    .demand(1)
    .config('config', 'JSON配置文件路径')
    .help()
    .alias('h', 'help')
    .locale('en')
    .showHelpOnFail(true, '使用--help查看有效选项')
    .epilog('copyright 2020 LunnLew')
    .argv;
}
module.exports = {
  run: AutoSignMachine_Run
}