FROM alpine:latest

WORKDIR /AutoSignMachine/

RUN apk add --no-cache tzdata nodejs npm
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 复制代码
COPY . /AutoSignMachine/

RUN npm install

COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT /entrypoint.sh