const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');
const { log } = require('winston');
const { response } = require('express');
const qrCodePathG = require("../config/config").server.qrcode_path;
const fs = require('fs');
const path = require('path');
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
// async function generateQRcodeTicketFromWXAPI(accessToken, userId) {
//     try {
//         const url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`;
//         const requestData = {
//             action_name: 'QR_LIMIT_STR_SCENE',
//             action_info: {
//                 scene: {
//                     scene_id: userId
//                 }
//             }
//         };
//         const response = await axios.post(url, requestData);
//         return response.data.ticket;
//     } catch (error) {
//         logger.error(`Error getting ticket for generating QR code: ${error.message}`);
//         throw new Error('Error getting ticket for generating QR code');
//     }
// }
// async function generateQRcodeFromTicket(ticket) 
// {
//     try {
//         const response = await axios.get(`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`,
//             {responseType: 'arraybuffer'}
//         );
//         return response.data;
//     } catch (error) {
//         logger.error(`Error generating QR code from ticket: ${error.message}`);
//         throw new Error('Error generating QR code from ticket');
//     }
// }
// async function generateQrCode(uid)
// {
//     try {
//         const qrCodeDir = path.join(qrCodePathG, "userCode");
//         const qrCodePath = path.join(qrCodeDir, `user_${uid}`);
//         const token = await getAccessToken();
//         const ticket = await generateQRcodeTicketFromWXAPI(token, uid);
//         const qrcode = await generateQRcodeFromTicket(ticket);
//         fs.writeFileSync(qrCodePath, qrcode);
//         return qrcode;
//     }catch(error)
//     {
//         logger.error(`Error generating QR code: ${error.message}`);
//         throw new Error('Error generating QR code');
//     }
// }

module.exports = {
    getAccessToken,
    createMenu,
    getOAuthAccessToken,
    getUserInfo,
    // generateQrCode,
};