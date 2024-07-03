const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const wechatController = require('./controllers/wechatController');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config/config');
const logger = require('./utils/logger');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // 在生产环境中应设置为true，使用https
}));

// 微信服务器验证
app.get('/wechat', wechatController.handleVerifyServer);

// 获取Access Token
app.get('/api/wechat/access_token', wechatController.handleGetAccessToken);

// 创建菜单
app.post('/api/wechat/create_menu', wechatController.handleCreateMenu);

// OAuth回调
app.get('/oauth/callback', wechatController.handleOAuthCallback);

// 处理表单提交
app.post('/api/promotion', (req, res) => {
    const { phone, receipt, installationDate } = req.body;
    // 在这里处理表单数据，例如存储到数据库
    logger.info(`Received form submission: Phone - ${phone}, Receipt - ${receipt}, Installation Date - ${installationDate}`);
    res.status(200).json({ message: 'Form submitted successfully!' });
});

app.use(errorHandler);

app.listen(config.server.port, () => {
    logger.info(`Server running on port ${config.server.port}`);
});
