// services/submitService.js
const Submission = require("../models/Submission");
const QrCode = require("qrcode");
const url = require("../config/config").server.url;
const qrCodePathG = require("../config/config").server.qrcode_path;
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database");

async function startTransaction()
{
 try{
  const transaction = await sequelize.transaction();
  return transaction;
 }catch(err)
 {
  console.error('Failed to start transaction:', err);
  throw err;
 } 
}
async function generateQrCode(userId) {
  console.log("generate qrcode for user: ", userId);
  const qrCodeDir = path.join(qrCodePathG, "userCode");
  const qrCodePath = path.join(qrCodeDir, `${userId}_qrcode.png`);
  // 如果二维码文件不存在，就生成并保存
  if (!fs.existsSync(qrCodePath)) {
    try {
      const qrCodeData = `${url}/user?userId=${userId}`; // 替换为实际的用户信息页面 URL
      const qrCodeImage = await QrCode.toDataURL(qrCodeData);
      const base64Data = qrCodeImage.replace(/^data:image\/\w+;base64,/, '');
      // 将 base64 数据写入文件
      fs.writeFileSync(qrCodePath, base64Data, 'base64');
    } catch (err) {
      console.error('Failed to generate or save QR Code:', err);
      throw new Error("Failed to generate or save QR Code"); // 抛出异常以便上层处理
    }
  }

  return qrCodePath; // 返回二维码文件路径
}

async function getSubmissionByUserId(UserId) {
  try {
    const userInfo = await Submission.User.findOne({ where: { id: UserId } });
    const userPromotionInfo = await Submission.PromotionInfo.findOne({
      where: { user_id: UserId },
    });
    return {
      userPromotionInfo: userPromotionInfo,
      userInfo: userInfo,
    };
  } catch (err) {
    console.log(err);
  }
}

async function checkSubmissionExists(receipt) {
  const existingReceipt = await Submission.User.findOne({
    where: { receipt: receipt },
  });
  if (existingReceipt) {
    throw new Error("Receipt already exists");
  }
  return false;
}
async function checkUserHasSubmit(openid) {
  const existingUser = await Submission.User.findOne({
    where: { openid: openid },
  });
  return existingUser;
}

async function checkAndSaveSubmission(
  openid,
  phone,
  nickname,
  receipt,
  installationDate
) {
  await checkSubmissionExists(receipt);
  // 存储信息到数据库
  const newSubmission = await Submission.User.create({
    openid: openid,
    phone: phone,
    receipt: receipt,
    nickname: nickname,
    installation_date: installationDate,
  });
  return newSubmission;
}

module.exports = {
  checkSubmissionExists,
  checkAndSaveSubmission,
  checkUserHasSubmit,
  getSubmissionByUserId,
  generateQrCode,
  startTransaction
};
