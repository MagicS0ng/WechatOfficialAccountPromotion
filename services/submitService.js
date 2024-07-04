// services/submitService.js
const Submission = require('../models/Submission');

async function checkSubmissionExists(phone, receipt) {
    const existingPhone = await Submission.findOne({ where: { phone: phone } });
    const existingReceipt = await Submission.findOne({ where: { receipt: receipt } });

    if (existingPhone) {
        throw new Error('Phone number already exists');
    }
    if (existingReceipt) {
        throw new Error('Receipt already exists');
    }

    return false;
}

async function checkAndSaveSubmission(phone, receipt, installationDate) {
    await checkSubmissionExists(phone, receipt);

    // 存储信息到数据库
    const newSubmission = await Submission.create({
        phone: phone,
        receipt: receipt,
        installation_date: installationDate
    });

    return newSubmission;
}

module.exports = {
    checkSubmissionExists,
    checkAndSaveSubmission
};
