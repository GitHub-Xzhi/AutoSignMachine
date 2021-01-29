FROM alpine:latest

WORKDIR /AutoSignMachine/

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
RUN apk add --no-cache tzdata nodejs npm
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 复制代码
COPY . /AutoSignMachine/

RUN npm install --registry https://registry.npm.taobao.org

COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT /entrypoint.sh