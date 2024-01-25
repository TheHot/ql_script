const axios = require("axios");
const cryptoJs = require("crypto-js");
const qs = require("qs");
const dayjs = require("dayjs");

async function login(account, password, requestid) {
  const pwd = cryptoJs.SHA256(password).toString();
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded",
    dnt: "1",
    "ctg-devicetype": "60",
    "ctg-version": "201360101",
    "ctg-appmodel": "2",
    "sec-ch-ua-mobile": "?0",
    "ctg-requestid": requestid,
    "ctg-devicecode": "web_NsNR2QXkapHCIORVdQJEo1LMGWTIAIHa",
    "ctg-timestamp": +new Date(),
    "sec-ch-ua-platform": '"Windows"',
    origin: "https://pc.ctyun.cn",
    referer: "https://pc.ctyun.cn/",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
  };

  const data = new URLSearchParams();
  data.append("userAccount", account);
  data.append("password", pwd);
  data.append("sha256Password", pwd);
  data.append("deviceCode", "web_NsNR2QXkapHCIORVdQJEo1LMGWTIAIHa");
  data.append("deviceName", "Chrome浏览器");
  data.append("deviceType", "60");
  data.append("deviceModel", "Windows+NT+10.0;+Win64;+x64");
  data.append("appVersion", "1.36.1");
  data.append("sysVersion", "Windows+NT+10.0;+Win64;+x64");
  data.append("clientVersion", "201360101");

  const config = {
    method: "POST",
    url: "https://desk.ctyun.cn:8810/api/auth/client/login",
    headers: headers,
    data: data,
  };

  const res = await axios.request(config);

  if (res.data.code === 51040) {
    return Promise.reject();
  } else {
    return res.data;
  }
}

async function conn(objId, userId, secretKey) {
  let data = qs.stringify({
    objId,
    objType: "0",
    osType: "15",
    deviceId: "60",
    deviceCode: "web_NsNR2QXkapHCIORVdQJEo1LMGWTIAIHa",
    deviceName: "Chrome浏览器",
    sysVersion: "Windows+NT+10.0;+Win64;+x64",
    appVersion: "1.36.1",
    hostName: "Chrome浏览器",
    vdCommand: "",
    ipAddress: "",
    macAddress: "",
    hardwareFeatureCode: "web_NsNR2QXkapHCIORVdQJEo1LMGWTIAIHa",
  });

  const devicetype = "60",
    tenantid = "250432",
    version = "201360101",
    timestamp = +new Date(),
    requestid = +new Date() + 10;

  const signaturestr =
    devicetype +
    requestid +
    tenantid +
    timestamp +
    userId +
    version +
    secretKey;

  let config = {
    method: "POST",
    url: "https://desk.ctyun.cn:8810/api/desktop/client/connect",
    headers: {
      "ctg-devicetype": devicetype,
      "ctg-userid": userId,
      "ctg-version": version,
      "ctg-appmodel": "2",
      "ctg-devicecode": "web_NsNR2QXkapHCIORVdQJEo1LMGWTIAIHa",
      "ctg-timestamp": timestamp,
      "ctg-tenantid": tenantid,
      "ctg-requestid": requestid,
      "ctg-signaturestr": cryptoJs.MD5(signaturestr).toString(),
    },
    data: data,
  };

  const res = await axios.request(config);
  return res.data;
}

async function main() {
  const accList = JSON.parse(process.env.TYYDN);
  for (const item of accList) {
    const [account, password, objId] = item.split("-");
    try {
      const requestid = +new Date() + 2;
      const { data } = await login(account, password, requestid);
      const res = await conn(objId, data.userId, data.secretKey);
      console.log(
        `[${dayjs().format("YYYY MM-DD HH:mm:ss")}]`,
        `${account}`,
        res.data.goingRetry !== undefined
          ? res.data.goingRetry
            ? "Pending"
            : "Active"
          : "连接失败！"
      );
    } catch (error) {
      console.log(
        `[${dayjs().format("YYYY MM-DD HH:mm:ss")}]`,
        `${account} 登录失败，请前往 pc 端输入验证码登录一次！`
      );
    }
  }
}

main();
