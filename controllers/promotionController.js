// controllers/promotionController.js
const { error } = require("winston");
const Submission = require("../models/Submission");
const submitService = require("../services/submitService");
const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const path = require("path");
const fs = require("fs");
async function handleGetUserPromotionInfo(req, res) {
  try {
    const { userPromotionInfo, userInfo } =
      await submitService.getSubmissionByUserId(req.query.userId);
    let installation_date = new Date(userInfo.installation_date);
    let expire_date = new Date(userPromotionInfo.withdraw_expiry_date);
    let timdDiff = Math.abs(
      expire_date.getTime() - installation_date.getTime()
    );
    let diffDays = Math.ceil(timdDiff / (1000 * 60 * 60 * 24));
    res.status(200).json({
      userPromotionInfo,
      userInfo,
      diffDays,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  }
}

async function handleCheckPromotion(req, res) {
  try {
    const { receipt } = req.body;
    await submitService.checkPromoteeReceiptExist(receipt);
    res.status(200).json({ message: "No duplicate found" });
  } catch (error) {
    if (error.message === "Receipt already exists") {
      res.status(400).json({ error: "Receipt already exists" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
async function handleSubmitPromotion(req, res) {
  const { userId, phone, receipt, installationDate } = req.body;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const submitPromotion = await submitService.submitPromotionRecords(
      userId,
      phone,
      receipt,
      installationDate,
      transaction
    );
    const promoter_id = submitPromotion.promoter_id;
    await Submission.PromotionInfo.update(
      { promotion_count: Sequelize.literal("promotion_count+1") },
      { where: { user_id: promoter_id },transaction },
    );
    const promotionInfo = await Submission.PromotionInfo.findOne({
      where: { user_id: promoter_id },transaction
    }, );
    const promotion_count = promotionInfo.dataValues.promotion_count;
    const newWithDrawableAmount = Number(promotion_count) * 1010;
    await Submission.PromotionInfo.update(
      { withdrawable_amount: newWithDrawableAmount.toFixed(2).toString() },
      { where: { user_id: promoter_id }, transaction },
      
    );
    await transaction.commit();
    res.status(200).json({
      success: true,
      message: "谢谢帮我推广! 本次推广成功",
      submitPromotion,
    });
  } catch (error) {
    await transaction.rollback();
    if(error.message === "promotion record submitted failed")
      res.status(400).json({ error: "promotion record submitted failed" });
    else
      res.status(500).json({ error: "Internal Server Error" });
    console.log(error);
  }
};
async function handleRedirectPromotion(req, res){
  const userId = req.query.userId;
  res.redirect(`/promotion.html?userId=${encodeURIComponent(userId)}`);
};
async function handleGetUserQrCode(req, res){
  const imagePath = path.join("F:\\CNS\\", "userCode", req.params.filename);
  console.log(imagePath);
  const userId = req.params.filename.split("_")[0];
  try {
    if (!fs.existsSync(imagePath)) {
      await submitService.generateQrCode(userId);
    }
    res.sendFile(imagePath);
  } catch (err) {
    res.status(500).send("Error generating QR code");
    console.log(err);
  }
}
module.exports = {
  handleGetUserPromotionInfo,
  handleCheckPromotion,
  handleSubmitPromotion,
  handleRedirectPromotion,
  handleGetUserQrCode
};
