// controllers/wechatController.js
const verifySignature = require("../utils/verifySignature");
const logger = require("../utils/logger");
const wechatService = require("../services/wechatService");
const { checkUserHasSubmit } = require("../services/submitService");

async function handleGetAccessToken(req, res) {
  try {
    const token = await wechatService.getAccessToken();
    res.status(200).json({ accessToken: token });
  } catch (error) {
    logger.error(`Error in handleGetAccessToken: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
function handleVerifyServer(req, res) {
  const echostr = verifySignature(req.query);
  if (echostr) {
    logger.info("WeChat server verification succeeded");
    res.send(echostr);
  } else {
    logger.error("WeChat server verification failed");
    res.status(401).send("Unauthorized");
  }
}
async function handleCreateMenu(req, res) {
  try {
    const result = await wechatService.createMenu();
    res.status(200).json(result);
    logger.info("Menu created successfully");
  } catch (error) {
    logger.error(`Error in handleCreateMenu: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function handleOAuthCallback(req, res) {
  const code = req.query.code;
  try {
    const tokenData = await wechatService.getOAuthAccessToken(code);
    const userInfo = await wechatService.getUserInfo(
      tokenData.access_token,
      tokenData.openid
    );

    req.session.user = userInfo;
    const isSummitted = await checkUserHasSubmit(userInfo.openid);
    if (isSummitted) {
      res.redirect(`/promotioninfo.html?userId=${isSummitted.id}`);
      return;
    }
    res.redirect("/form.html");
  } catch (error) {
    logger.error(`Error in handleOAuthCallback: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleGetAccessToken,
  handleCreateMenu,
  handleVerifyServer,
  handleOAuthCallback,
};
