// controllers/submitController.js
const submitService = require("../services/submitService");

async function handleFormSubmission(req, res) {
  const openid = req.session.user.openid;
  const nickname = req.session.user.nickname;
  const { phone, receipt, installationDate } = req.body;
  try {
    const submission = await submitService.checkAndSaveSubmission(
      openid,
      phone,
      nickname,
      receipt,
      installationDate,
    );
    res.status(200).json({
      message: "Form submitted successfully!",
      submission,
      redirect: `/promotioninfo.html?userId=${submission.id}`,
    });
  } catch (error) {
    if(error.message=="Failed to generate or save QR Code")
      {
        res.status(500).json({ error: "Failed to generate or save QR Code" });
      }
    if (error.message === "Phone number already exists") {
      res.status(400).json({ error: "Phone number already exists" });
    } else if (error.message === "Receipt already exists") {
      res.status(400).json({ error: "Receipt already exists" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function handleCheckSubmission(req, res) {
  const { receipt } = req.body;
  try {
    await submitService.checkSubmissionExists(receipt);
    res.status(200).json({ message: "No duplicate found" });
  } catch (error) {
    if (error.message === "Receipt already exists") {
      res.status(400).json({ error: "Receipt already exists" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = {
  handleFormSubmission,
  handleCheckSubmission,
};
