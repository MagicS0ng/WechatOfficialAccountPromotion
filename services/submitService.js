// services/submitService.js
const Submission = require("../models/Submission");
const QrCode = require("qrcode");
const url = require("../config/config").server.url;
const qrCodePathG = require("../config/config").server.qrcode_path;
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/database");
const logger = require("../utils/logger");

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
  const qrCodeDir = path.join(qrCodePathG, "userCode");
  const qrCodePath = path.join(qrCodeDir, `${userId}_qrcode.png`);
  // 如果二维码文件不存在，就生成并保存
  if (!fs.existsSync(qrCodePath)) {
    try {
      const qrCodeData = `${url}/user/userId?userId=${encodeURIComponent(userId)}`; // 替换为实际的用户信息页面 URL
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
  let transaction;
  try {
    transaction = await sequelize.transaction();
    await checkSubmissionExists(receipt);
    // 存储信息到数据库
    const newSubmission = await Submission.User.create({
      openid: openid,
      phone: phone,
      receipt: receipt,
      nickname: nickname,
      installation_date: installationDate,
    },{transaction});
    await Submission.PromotionInfo.create({
      user_id: newSubmission.id,
      promotion_count: 0,
      withdrawable_amount: 0,
      withdraw_expiry_date: newSubmission.expire_at,
    }, {transaction});
    await transaction.commit();
    return newSubmission;
  } catch (error) {
    await transaction.rollback();
    logger.error(
      error,
      "failed to submit user info while registering for promotion"
    );
    console.log(error);
  }
}
async function checkPromoteeReceiptExist(receipt, transaction)
{
  const existingReceipt = await Submission.PromotionRecord.findOne({
    where: { receipt: receipt }, 
  },{transaction});
  if (existingReceipt) {
    throw new Error("Receipt already exists");
  }
  return false;
}
async function submitPromotionRecords(
  promoter_id,
  phone,
  receipt,
  installationDate,
  transaction
)
{
  await checkSubmissionExists(receipt) 
  await checkPromoteeReceiptExist(receipt,transaction);
  try {
    const newPromotion = await Submission.PromotionRecord.create({
      promoter_id: promoter_id,
      promotee_phone: phone,
      receipt: receipt,
      installation_date: installationDate,
      transaction
    });
    return newPromotion;
  } catch (error) {
    console.log(error, "promotion record submitted failed");
    throw new Error("promotion record submitted failed");    
  }
}

module.exports = {
  checkSubmissionExists,
  checkAndSaveSubmission,
  checkUserHasSubmit,
  getSubmissionByUserId,
  generateQrCode,
  startTransaction,
  checkPromoteeReceiptExist,
  submitPromotionRecords
};
