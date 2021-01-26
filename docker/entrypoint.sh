#!/bin/sh

crontab -r
if [ ${enable_52pojie} ];then
  echo "10 13 * * *       node /AutoSignMachine/index.js 52pojie --htVD_2132_auth=${htVD_2132_auth} --htVD_2132_saltkey=${htVD_2132_saltkey}" >> /var/spool/cron/crontabs/root
fi

if [ ${enable_bilibili} ];then
  echo "*/30 7-22 * * *       node /AutoSignMachine/index.js bilibili --cookies ${cookies} --username ${username} --password ${password} ${othercfg}" >> /var/spool/cron/crontabs/root
fi

if [ ${enable_iqiyi} ];then
  echo "*/30 7-22 * * *       node /AutoSignMachine/index.js iqiyi --P00001 ${P00001} --P00PRU ${P00PRU} --QC005 ${QC005}  --dfp ${dfp}" >> /var/spool/cron/crontabs/root
fi

if [ ${enable_unicom} ];then
  echo "*/30 7-22 * * *       node /AutoSignMachine/index.js unicom --cookies ${cookies} --user ${user} --password ${password} --appid ${appid}" >> /var/spool/cron/crontabs/root
fi

/usr/sbin/crond -S -c /var/spool/cron/crontabs -f -L /dev/stdout