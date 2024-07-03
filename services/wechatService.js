const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

async function getAccessToken() {
    try {
        const response = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
            params: {
                grant_type: 'client_credential',
                appid: config.wechat.appId,
                secret: config.wechat.appSecret
            }
        });
        return response.data.access_token;
    } catch (error) {
        logger.error(`Error getting access token: ${error.message}`);
        throw new Error('Failed to get access token');
    }
}

async function createMenu() {
    try {
        const token = await getAccessToken();
        const menuData = {
            button: [
                {
                    type: 'view',
                    name: 'Promotion',
                    url: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.wechat.appId}&redirect_uri=${encodeURIComponent(config.wechat.redirectUri)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
                }
            ]
        };
        const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`, menuData);
        return response.data;
    } catch (error) {
        logger.error(`Error creating menu: ${error.message}`);
        throw new Error('Failed to create menu');
    }
}

async function getOAuthAccessToken(code) {
    try {
        const response = await axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
            params: {
                appid: config.wechat.appId,
                secret: config.wechat.appSecret,
                code: code,
                grant_type: 'authorization_code'
            }
        });
        return response.data;
    } catch (error) {
        logger.error(`Error getting OAuth access token: ${error.message}`);
        throw new Error('Failed to get OAuth access token');
    }
}

async function getUserInfo(accessToken, openId) {
    try {
        const response = await axios.get('https://api.weixin.qq.com/sns/userinfo', {
            params: {
                access_token: accessToken,
                openid: openId,
                lang: 'zh_CN'
            }
        });
        return response.data;
    } catch (error) {
        logger.error(`Error getting user info: ${error.message}`);
        throw new Error('Failed to get user info');
    }
}
module.exports = {
    getAccessToken,
    createMenu,
    getOAuthAccessToken,
    getUserInfo
};