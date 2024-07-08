const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const wechatController = require("./controllers/wechatController");
const submitController = require("./controllers/submitController");
const promotionController = require("./controllers/promotionController");
const errorHandler = require("./middlewares/errorHandler");
const config = require("./config/config");
const logger = require("./utils/logger");
const sequelize = require("./config/database");
const path = require('path');
// const wechatService = require("./services/wechatService");
const submitService = require("./services/submitService");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(express.raw({ type: 'text/xml' }));
app.use(express.static("public"));
app.use("/userQrCode", express.static("./userCode"));
app.use(errorHandler);
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // 在生产环境中应设置为true，使用https
  })
);
sequelize
  .sync()
  .then(() => {
    logger.info("Database synchronized");
  })
  .catch((err) => {
    logger.error(`Database synchronization error: ${err.message}`);
  });
// 微信服务器验证
app.get("/wechat", wechatController.handleVerifyServer);

// 获取Access Token
app.get("/api/wechat/access_token", wechatController.handleGetAccessToken);

// 创建菜单
app.post("/api/wechat/create_menu", wechatController.handleCreateMenu);

// OAuth回调
app.get("/oauth/callback", wechatController.handleOAuthCallback);
// 处理表单提交
app.post("/api/userinfosubmission", submitController.handleFormSubmission);
app.post(
  "/api/userinfosubmission/check",
  submitController.handleCheckSubmission
);
//  处理用户推广
app.post("/api/promotionrecord/check", promotionController.handleCheckPromotion);
app.post("/api/promotionrecord", promotionController.handleSubmitPromotion);

// app.post("/wechat", wechatController.handleScanEvent);
app.get(
  "/api/getuserpromotion",
  promotionController.handleGetUserPromotionInfo
);
app.get("/api/getQrCode/:filename", async (req, res) => {
  const imagePath = path.join(__dirname, "userCode", req.params.filename);
  const userId = req.params.filename.split("_")[0];
  try {
    if (!fs.existsSync(imagePath)) {
      await submitService.generateQrCode(userId);
    }
    res.sendFile(imagePath);
  } catch (err) {
    logger.error(
      `Error generating QR code while loading page: promotionInfo: ${err.message}`
    );
    console.log(err);
  }
});
app.get('/user/:userId', async (req, res) => {
  const userId = req.query.userId
  res.redirect(`/promotion.html?userId=${encodeURIComponent(userId)}`);
})
app.listen(config.server.port, () => {
  logger.info(`Server running on port ${config.server.port}`);
});
