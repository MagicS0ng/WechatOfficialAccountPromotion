const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const wechatController = require("./controllers/wechatController");
const submitController = require("./controllers/submitController");
const promotionController = require("./controllers/promotionController");
const withdrawalController = require("./controllers/withdrawalController")
const errorHandler = require("./middlewares/errorHandler");
const config = require("./config/config");
const logger = require("./utils/logger");
const { initialize } = require("./models/init");
const adminController = require("./controllers/adminController");
const recordManageController = require("./controllers/recordManageController");
const authMidware = require("./middlewares/authMiddlewares");
(async () => {
  try {
    await initialize();
    console.log("Sync complete!");
  } catch (error) {
    console.error("Error during sync:", error);
  }
})();
adminController
  .createSuperAdmin("superadmin")
  .then(() => {
    console.log("创建一个超级管理员");
  })
  .catch((error) => {
    console.error("创建超级管理员失败", error);
  });
const app = express();
app.use(bodyParser.json());
app.use(express.raw({ type: "text/xml" }));
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
app.post(
  "/api/promotionrecord/check",
  promotionController.handleCheckPromotion
);
app.post("/api/promotionrecord", promotionController.handleSubmitPromotion);

// app.post("/wechat", wechatController.handleScanEvent);
app.get(
  "/api/getuserpromotion",
  promotionController.handleGetUserPromotionInfo
);
app.get(
  "/api/getPendingWithdrawState",
  withdrawalController.handleisExistPendingWithdraw
);
app.get("/api/submitwithdrawal", withdrawalController.handlesubmitWithdrawl);
// app.get("/api/getWithdrawState", withdrawalController.handleWithdrawRecords);
app.get("/api/getQrCode/:filename", promotionController.handleGetUserQrCode);
app.get("/user/:userId", promotionController.handleRedirectPromotion);

// 管理员登录、注册的路由
app.post("/api/admin/register", adminController.registerAdmin);
app.post("/api/admin/login", adminController.loginAdmin);
app.get("/admin/register", async (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});
app.get("/admin/login", async (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.get("/admin/dashboard", authMidware, (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});
app.get("/api/admin/checkauth", async (req, res) => {
  if(req.session && req.session.user)
  {
    res.json({authenticated: true, username: req.session.user.username});
  }else{
    res.json({authenticated: false});
  }
})
app.get("/api/admin/fetchrecords", recordManageController.fetchRecords);
app.put("/api/admin/submitreview", recordManageController.submitReview);
app.listen(config.server.port, () => {
  logger.info(`Server running on port ${config.server.port}`);
});
