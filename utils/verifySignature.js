// utils/verifySignature.js
const crypto = require('crypto');
const config = require('../config/config');

function verifySignature(query) {
    const { signature, timestamp, nonce, echostr } = query;
    const token = config.wechat.token;

    const tmpArr = [token, timestamp, nonce].sort();
    const tmpStr = tmpArr.join('');
    const hash = crypto.createHash('sha1').update(tmpStr).digest('hex');

    return hash === signature ? echostr : false;
}

module.exports = verifySignature;
