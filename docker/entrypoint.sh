#!/bin/sh

if [ ${enable_52pojie} ];then
  echo "10 13 * * *       node /AutoSignMachine/index.js 52pojie --htVD_2132_auth=${htVD_2132_auth} --htVD_2132_saltkey=${htVD_2132_saltkey}" >> /etc/crontabs/root
fi

if [ ${enable_bilibili} ];then
  echo "10 13 * * *       node /AutoSignMachine/index.js bilibili --cookies ${cookies}" >> /etc/crontabs/root
fi

if [ ${enable_iqiyi} ];then
  echo "10 13 * * *       node /AutoSignMachine/index.js iqiyi --P00001 ${P00001} --P00PRU ${P00PRU} --QC005 ${QC005}  --dfp ${dfp}" >> /etc/crontabs/root
fi

if [ ${enable_unicom} ];then
  echo "10 13 * * *       node /AutoSignMachine/index.js unicom --cookies ${cookies} --user ${user} --password ${password}" >> /etc/crontabs/root
fi

/usr/sbin/crond -c /etc/crontabs -f

tail -f /var/log/cron.log