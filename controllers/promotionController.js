// controllers/promotionController.js
const { error } = require("winston");
const Submission = require("../models/Submission");
const submitService = require("../services/submitService");

async function handleGetUserPromotionInfo(req, res) {
  try {
    const { userPromotionInfo, userInfo } =
      await submitService.getSubmissionByUserId(req.query.userId);
      let installation_date = new Date(userInfo.installation_date);
      let expire_date = new Date(userPromotionInfo.withdraw_expiry_date);
      let timdDiff = Math.abs(expire_date.getTime()-installation_date.getTime());
      let diffDays = Math.ceil(timdDiff/(1000*60*60*24));
    res.status(200).json({
      userPromotionInfo,
      userInfo,
      diffDays
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  }
}

async function handleCheckPromotion(req, res)
{
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
async function handleSubmitPromotion(req, res)
{
    const { userId, phone, receipt, installationDate } = req.body;
    try {
      const submitPromotion = await submitService.submitPromotionRecords(
        userId,
        phone,
        receipt,
        installationDate
      );
      res.status(200).json({
        success: true,
        message: "谢谢帮我推广! 本次推广成功",
        submitPromotion,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.log(error);
    }
};
module.exports = {
  handleGetUserPromotionInfo,
  handleCheckPromotion,
  handleSubmitPromotion
};
