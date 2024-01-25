### 天翼云电脑防休眠

#### 依赖

- axios
- crypto-js
- ql
- dayjs

#### 变量及任务

```js
### 变量及数据格式
TYYDN ['账号1-登录密码-云电脑编号后8位', '账号2-登录密码-云电脑编号后8位']
### 定时任务一分钟一次
0 0/1 * * * ?
```

#### 说明

登录失败需要去网页端手动输入图片验证码登录一次即可避免再次出现验证码。

### 天翼云电脑防休眠扫码版

#### 依赖

- puppeteer
- dayjs

#### 环境配置

```shell
# 1. 进入青龙容器
docker exec -i -t qinglong /bin/bash
# 2. 修改 apk 源
sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
# 安装 chromiu 及套件
apk add --no-cache chromium nss freetype freetype-dev harfbuzz ca-certificates ttf-freefont
```
