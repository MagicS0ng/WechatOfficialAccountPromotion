// controllers/promotionController.js
const { error } = require("winston");
const Submission = require("../models/Submission");
const submitService = require("../services/submitService");
const QrCode = require("qrcode");

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
module.exports = {
  handleGetUserPromotionInfo,
};
