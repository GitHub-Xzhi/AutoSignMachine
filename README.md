# AutoSignMachine

**一个自动执行任务的工具，通过它可以实现账号自动签到，自动领取权益等功能，帮助我们轻松升级。**

**通过结合GitHub Actions，可以实现每天线上自动运行，一劳永逸。**

## bilibili签到任务
**实现现B站帐号的每日自动观看、分享、投币视频，获取经验，每月自动领取会员权益等功能，帮助我们轻松升级会员到Lv6并赚取电池。**

详细功能目录如下:

* **每天自动登录，获取经验**
* **每天自动观看、分享、投币视频**
* **每天漫画自动签到**
* **每天自动直播签到，领取奖励**
* **每天自动使用直播中心银瓜子兑换B币**
* **每个月自动领取5张B币券和大会员权益**

```sh
node index.js bilibili --cookies "b6*********4a581;"
```

### docker部署
```sh
# 构建
docker build -t auto-sign-machine:latest  -f docker/Dockerfile .
# 运行
docker run \
  --name auto-sign-machine \
  -d \
  -e enable_bilibili=true \
  -e DedeUserID=41*****1073  \
  -e SESSDATA=05*********333*b1 \
  -e bili_jct=b6*********4a581 \
  auto-sign-machine:latest
```

## 52pojie签到任务
**实现现52pojie帐号的每日签到任务。**

```sh
node index.js 52pojie --htVD_2132_auth b22d**********************aNjr --htVD_2132_saltkey Jc***********I
```

### docker部署
```sh
# 构建
docker build -t auto-sign-machine:latest  -f docker/Dockerfile .
# 运行
docker run \
  --name auto-sign-machine \
  -d \
  --label traefik.enable=false \
  -e enable_52pojie=true \
  -e htVD_2132_auth=b******************jr \
  -e htVD_2132_saltkey=Jc************I \
  auto-sign-machine:latest
```
、
## iqiyi签到任务
**实现现iqiyi帐号的每日签到任务。**
详细功能目录如下:

* **普通用户每天自动获取积分**
* **vip用户每日签到随机成长值及积分**
* **vip用户每日浏览会员俱乐部+1成长值**

```sh
node index.js iqiyi --P00001 b********jr --P00PRU 12***24 --QC005 5f******6fe --dfp Jc************I
```

### docker部署
```sh
# 构建
docker build -t auto-sign-machine:latest  -f docker/Dockerfile .
# 运行
docker run \
  --name auto-sign-machine \
  -d \
  --label traefik.enable=false \
  -e enable_iqiyi=true \
  -e P00001=b********jr \
  -e P00PRU=12***24 \
  -e QC005=5f******6fe \
  -e dfp=Jc************I \
  auto-sign-machine:latest
```


、
## 联通APP签到任务
**实现现联通帐号的每日签到任务。**
详细功能目录如下:

* **每日签到积分**
* **冬奥积分活动**
* **每日定向积分**
* **每日游戏楼层宝箱**
* **每日抽奖**
* **首页-游戏-娱乐中心-沃之树**
* **首页-小说-阅读越有礼打卡赢话费**
* **首页-小说-读满10章赢好礼**
* **首页-小说-读满10章赢好礼-看视频领2积分**
* **首页-签到有礼-免流量得福利-3积分天天拿(阅读打卡)**
* **首页-小说-阅读福利抽大奖**
* **首页-签到有礼-免费领-浏览领积分**
* **首页-签到有礼-免费拿-看视频夺宝**
* **首页-签到有礼-免费抽**
* **首页-签到有礼-赚更多福利**
* **首页-游戏-娱乐中心-每日打卡**
* **每日游戏时长-天天领取1G流量包**

```sh
node index.js unicom --user 131*******12 --pasword 11****11 --appid f7af****ebb
```

### docker部署
```sh
# 构建
docker build -t auto-sign-machine:latest  -f docker/Dockerfile .
# 运行(cookies和账号密码两种方式二选一)
docker run \
  --name auto-sign-machine \
  -d \
  --label traefik.enable=false \
  -e enable_unicom=true \
  -e user=131*******12 \
  -e pasword=11****11 \
  -e appid=f7af****ebb \
  auto-sign-machine:latest
```

### 注意
#### cron中`%`号需要转义`\%`