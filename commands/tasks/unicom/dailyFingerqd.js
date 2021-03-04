const {
  UnicomComponent,
  generateOrderid,
  sleep,
} = require("./handlers/gameUtils");
let crypto = require("crypto");
const gameEvents = require("./handlers/dailyEvent");
const AES = require("./handlers/PAES");
const { exit } = require("process");
let dailyFingerqd = {
  doTask: async (axios, options) => {
    console.log("😒 猜拳拿奖...开始");
    let request = new UnicomComponent(axios, options, "猜拳拿奖");
    //登录平台
    let cookies = await request.login(
      "https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://m.jf.10010.com/jf-order/avoidLogin/forActive/fingerSignq&duanlianjieabc=tbKFo"
    );
    let times = await request.postFreeLoginGuess(
      "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/yuech-Blindbox/fingerqd/index.html?jump=sign",
      "Ac-yc0001,Ac-yc0002,Ac-yc0003",
      cookies,
      (data) => {
        let temp = [
          {
            activityId: "Ac-yc0002",
            integral: 50,
            roundGame: null,
            activityName: "刘备",
          }, // 刘备
          {
            activityId: "Ac-yc0001",
            integral: 50,
            roundGame: null,
            activityName: "关羽",
          }, // 关羽
          {
            activityId: "Ac-yc0003",
            integral: 50,
            roundGame: null,
            activityName: "张飞",
          }, // 张飞
        ];
        let activity = [];
        if (data.data.roundGame !== null) {
          temp.map((value, i) => {
            if (value.activityId == data.data.roundGame.activityId) {
              temp[i]["roundGame"] = data.data.roundGame;
            } else {
              temp[i]["roundGame"] = null;
            }
          });
          let currentIdx = temp.findIndex(
            (v) => v.activityId == data.data.roundGame.activityId
          );
          activity.push(temp[currentIdx]);
          temp.splice(currentIdx, 1);
          activity = activity.concat(temp);
        } else {
          activity = temp;
        }
        for (let game of data.data.activityInfos.activityVOs) {
          for (let item of activity) {
            if (item.activityId === game.activityId) {
              item["freeTimes"] = game.activityTimesInfo.freeTimes;
              item["advertTimes"] = game.activityTimesInfo.advertTimes;
            }
          }
        }
        // console.log(activity);
        // exit(0);
        // console.log(data);
        return {
          Authorization: data.data.token.access_token,
          // roundGame: data.data.roundGame,
          activity: activity,
        };
      }
    );
    await dailyFingerqd.playGames(axios, options, cookies, times);
  },
  playGames: async (
    axios,
    options,
    { ecs_token, searchParams, jar1 },
    { Authorization, activity }
  ) => {
    let request = new UnicomComponent(axios, options, "猜拳拿奖");

    for (let item of activity) {
      console.log(`与${item.activityName}进行猜拳...`);
      let { freeTimes, advertTimes, activityId, roundGame, integral } = item;
      do {
        console.log(
          "已消耗机会",
          1 + 3 - (freeTimes + advertTimes),
          "剩余免费机会",
          freeTimes,
          "看视频广告机会",
          advertTimes
        );
        let playParams;
        //免费机会为0,需要看视频
        if (freeTimes == 0 && advertTimes == 0) {
          console.log(`与${item.activityName}猜拳无机会!,进行下一轮`);
          continue;
        }
        if (!freeTimes && advertTimes) {
          console.log("视频补充");
          let params = {
            arguments1: "AC20200611152252", // acid
            arguments2: "GGPD", // yhChannel
            arguments3: "627292f1243148159c58fd58917c3e67", // yhTaskId menuId
            arguments4: new Date().getTime(), // time
            arguments6: "517050707",
            arguments7: "517050707",
            arguments8: "123456",
            arguments9: "4640b530b3f7481bb5821c6871854ce5",
            netWay: "Wifi",
            remark1: "签到小游戏猜拳拿奖",
            remark: "签到页小游戏",
            version: `android@8.0102`,
            codeId: 945757409,
          };
          params["sign"] = AES.sign([
            params.arguments1,
            params.arguments2,
            params.arguments3,
            params.arguments4,
          ]);
          params["orderId"] = crypto
            .createHash("md5")
            .update(new Date().getTime() + "")
            .digest("hex");
          params["arguments4"] = new Date().getTime();

          let result = await require("./taskcallback").reward(axios, {
            ...options,
            params,
            jar: jar1,
          });
          console.log(result);
          playParams = {
            activityId: activityId,
            currentTimes: advertTimes,
            type: "广告",
            integral: integral,
            orderId: params["orderId"],
            phoneType: "android",
            version: "8.0102",
          };
          await sleep(30);
          advertTimes--;
          // eslint-disable-next-line no-unused-vars
        } else {
          playParams = {
            activityId: activityId,
            currentTimes: freeTimes,
            integral: integral,
            type: "免费",
          };
          freeTimes--;
        }
        // console.log(playParams);
        let roundId;
        if (roundGame == null) {
          let body = gameEvents.encodeParams(playParams, true);
          let config = {
            url: `https://m.jf.10010.com/jf-yuech/api/gameResultV2/minusRondGames`,
            body,
            method: "POST",
            headers: {
              Authorization: `Bearer ${Authorization}`,
              referer:
                "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/yuech-Blindbox/fingerqd/index.html?jump=sign",
              options: "https://m.jf.10010.com",
            },
          };
          let { data } = await request.get(config);
          // console.log(data);
          if (data.code !== 0 || data.data.code !== "0") {
            console.log("something went wrong:", data);
            continue;
          }
          roundId = data.data.roundGame.roundId;
        } else {
          roundId = roundGame.roundId;
        }

        //游戏要进行三轮,如果得不到积分就机会-1 正常情况是玩不到三轮的.

        let gamebits = {
          activityId: activityId,
          resultId: roundId,
        };
        for (let i = 0; i < 2; i++) {
          console.log(`第${i + 1}轮猜拳...`);
          await sleep(10);
          let body = gameEvents.encodeParams(gamebits, true);
          let config = {
            url: `https://m.jf.10010.com/jf-yuech/api/gameResultV2/roundGameForPrize`,
            body: body,
            method: "POST",
            headers: {
              Authorization: `Bearer ${Authorization}`,
              referer:
                "https://m.jf.10010.com/cms/yuech/unicom-integral-ui/yuech-Blindbox/fingerqd/index.html?jump=sign",
              options: "https://m.jf.10010.com",
            },
          };
          let { data } = await request.get(config);
          // console.log(data);
          if (data.code !== 0) {
            console.log("猜拳拿奖:", data.message);
          } else {
            console.log(
              "猜拳拿奖:",
              data.data.drawResultPO !== null
                ? data.data.drawResultPO.prizeName
                : "未中奖"
            );
            if (
              data.data.drawResultPO !== null &&
              data.data.drawResultPO.doublingStatus
            ) {
              console.log("🌈 提交积分翻倍");
              await sleep(30);
              await dailyFingerqd.lookVideoDouble(axios, {
                ...options,
              });
              await dailyFingerqd.lookVideoDoubleResult(axios, {
                ...options,
                Authorization,
                activityId: activityId,
                winningRecordId: data.data.drawResultPO.winningRecordId,
              });
            }
          }
        }
      } while (freeTimes || advertTimes);
    }
  },
  lookVideoDouble: async (axios, options) => {
    let params = {
      arguments1: "AC20200611152252",
      arguments2: "GGPD",
      arguments3: "627292f1243148159c58fd58917c3e67",
      arguments4: new Date().getTime(),
      arguments6: "517050707",
      netWay: "Wifi",
      version: `android@8.0102`,
    };
    params["sign"] = AES.sign([
      params.arguments1,
      params.arguments2,
      params.arguments3,
      params.arguments4,
    ]);
    let { num, jar } = await require("./taskcallback").query(axios, {
      ...options,
      params,
    });

    if (!num) {
      console.log("签到小游戏猜拳: 今日已完成");
      return;
    }

    params = {
      arguments1: "AC20200611152252", // acid
      arguments2: "GGPD", // yhChannel
      arguments3: "627292f1243148159c58fd58917c3e67", // yhTaskId menuId
      arguments4: new Date().getTime(), // time
      arguments6: "",
      arguments7: "",
      arguments8: "",
      arguments9: "",
      orderId: generateOrderid(),
      netWay: "Wifi",
      remark: "签到小游戏猜拳拿奖",
      version: `android@8.0100`,
      codeId: 945689604,
    };
    params["sign"] = AES.sign([
      params.arguments1,
      params.arguments2,
      params.arguments3,
      params.arguments4,
    ]);
    await require("./taskcallback").doTask(axios, {
      ...options,
      params,
      jar,
    });
  },
  lookVideoDoubleResult: gameEvents.lookVideoDoubleResult("猜拳拿奖"),
};

module.exports = dailyFingerqd;
