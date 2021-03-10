> Due to a third-party risk dispute, this script stopped sharing n>  n> 由于第三方风险争议，此脚本停止分享 n n> 由于其他原因，该项目暂时停止维护 n# AutoSignMachine n n**一个自动执行任务的工具，通过它可以实现账号自动签到，自动领取权益等功能，帮助我们轻松升级。** n n## bilibili签到任务 n**实现现B站帐号的每日自动观看、分享、投币视频，获取经验，每月自动领取会员权益等功能，帮助我们轻松升级会员到Lv6并赚取电池。** n n详细功能目录如下: n n* **每天自动登录，获取经验** n* **每天自动观看、分享、投币视频** n* **每天漫画自动签到** n* **每天自动直播签到，领取奖励** n* **每天自动使用直播中心银瓜子兑换B币** n* **每个月自动领取5张B币券和大会员权益** n n```sh nnode index.js bilibili --cookies  "b6*********4a581; " n``` n n### docker部署 n```sh n# 构建 ndocker build -t auto-sign-machine:latest  -f docker/Dockerfile . n# 运行 ndocker run    n  --name auto-sign-machine    n  -d    n  -e enable_bilibili=true    n  -e DedeUserID=41*****1073     n  -e SESSDATA=05*********333*b1    n  -e bili_jct=b6*********4a581    n  auto-sign-machine:latest n``` n n## 52pojie签到任务 n**实现现52pojie帐号的每日签到任务。** n n```sh nnode index.js 52pojie --htVD_2132_auth b22d**********************aNjr --htVD_2132_saltkey Jc***********I n``` n n### docker部署 n```sh n# 构建 ndocker build -t auto-sign-machine:latest  -f docker/Dockerfile . n# 运行 ndocker run    n  --name auto-sign-machine    n  -d    n  --label traefik.enable=false    n  -e enable_52pojie=true    n  -e htVD_2132_auth=b******************jr    n  -e htVD_2132_saltkey=Jc************I    n  auto-sign-machine:latest n``` n、 n## iqiyi签到任务 n**实现现iqiyi帐号的每日签到任务。** n详细功能目录如下: n n* **普通用户每天自动获取积分** n* **vip用户每日签到随机成长值及积分** n* **vip用户每日浏览会员俱乐部+1成长值** n n```sh nnode index.js iqiyi --P00001 b********jr --P00PRU 12***24 --QC005 5f******6fe --dfp Jc************I n``` n n### docker部署 n```sh n# 构建 ndocker build -t auto-sign-machine:latest  -f docker/Dockerfile . n# 运行 ndocker run    n  --name auto-sign-machine    n  -d    n  --label traefik.enable=false    n  -e enable_iqiyi=true    n  -e P00001=b********jr    n  -e P00PRU=12***24    n  -e QC005=5f******6fe    n  -e dfp=Jc************I    n  auto-sign-machine:latest n``` n n n、 n## 联通APP签到任务 n**实现现联通帐号的每日签到任务。** n详细功能目录如下: n n* **每日签到积分** n* **冬奥积分活动** n* **每日定向积分** n* **每日游戏楼层宝箱** n* **每日抽奖** n* **首页-游戏-娱乐中心-沃之树** n* **首页-小说-阅读越有礼打卡赢话费** n* **首页-小说-读满10章赢好礼** n* **首页-小说-读满10章赢好礼-看视频领2积分** n* **首页-签到有礼-免流量得福利-3积分天天拿(阅读打卡)** n* **首页-小说-阅读福利抽大奖** n* **首页-签到有礼-免费领-浏览领积分** n* **首页-签到有礼-免费拿-看视频夺宝** n* **首页-签到有礼-免费抽** n* **首页-签到有礼-赚更多福利** n* **首页-游戏-娱乐中心-每日打卡** n* **每日游戏时长-天天领取3G流量包** n* **首页-积分查询-游戏任务** n n```sh nnode index.js unicom --user 131*******12 --password 11****11 --appid f7af****ebb n``` n n### docker部署 n```sh n# 构建 ndocker build -t auto-sign-machine:latest  -f docker/Dockerfile . n# 运行(cookies和账号密码两种方式二选一) ndocker run    n  --name auto-sign-machine    n  -d    n  --label traefik.enable=false    n  -e enable_unicom=true    n  -e user=131*******12    n  -e password=11****11    n  -e appid=f7af****ebb    n  auto-sign-machine:latest n``` n n### 注意 n#### cron中`%`号需要转义`  %` n n### 脚本运行机制 n任务并非在一次命令执行时全部执行完毕，任务创建时会根据某个时间段，将所有任务分配到该时间段内的随机的某个时间点，然后使用定时任务定时运行脚本入口，内部子任务的运行时机依赖于任务配置项的运行时间及延迟时间，这种机制意味着，只有当脚本的运行时间在当前定时任务运行时间之前，脚本子任务才有可能有选择的被调度出来运行 n n### crontab 任务示例 n在4-23小时之间每隔三十分钟尝试运行可运行的脚本子任务 n```txt n*/30 4-23 * * * /bin/node /workspace/AutoSignMachine/index.js unicom --user 1******5 --password 7****** --appid 1************9 n``` n n### 多用户配置 n启用`--accountSn`表示账户序号，例如`1,2`, 则将提取`option-sn`选项的值，例如`user-1`,`user-2` n n### 配置文件示例 n启用`--config /path/to/mycfg.json`表示配置文件 n```json n{ n     "accountSn ":  "1,2 ", n     "user-1 ":  "22******1 ", n     "password-1 ":  "31******1 ", n     "appid-1 ":  "41******1 ", n     "user-2 ":  "25******1 ", n     "password-3 ":  "72******1 ", n     "appid-2 ":  "92******1 " n} n``` n n### 运行测试 n```sh n## 立即模式, 一次性执行所有任务，仅建议测试任务是否正常时运行，该方式无法重试周期任务 n## 该模式不缓存cookie信息，频繁使用将可能导致账号安全警告 n#增加 --tryrun n n## 指定任务模式，可以指定仅需要运行的子任务，多用户使用规则参看`多用户配置` n#增加 --tasks taskName1,taskName2,taskName3 n``` n n### GitHub Actions 运行问题 n暂未处理GitHub Actions支持 

