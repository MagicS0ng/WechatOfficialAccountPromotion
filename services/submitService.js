// services/submitService.js
const Submission = require("../models/Submission");
const logger = require("../utils/logger");

async function checkSubmissionExists(receipt) {
  const existingReceipt = await Submission.findOne({
    where: { receipt: receipt },
  });
  if (existingReceipt) {
    throw new Error("Receipt already exists");
  }
  return false;
}
async function checkUserHasSubmit(openid) {
  const existingUser = await Submission.findOne({ where: { openid: openid } });
  if (existingUser) return true;
  return false;
}

async function checkAndSaveSubmission(
  openid,
  phone,
  nickname,
  receipt,
  installationDate
) {
  console.log("a?");
  await checkSubmissionExists(receipt);
  // 存储信息到数据库
  const newSubmission = await Submission.create({
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
};
