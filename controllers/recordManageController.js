const submitService = require("../services/submitService");
async function fetchRecords(req, res) {
  try {
    const records = await submitService.fetchWithdrawalsWithSelectedColumns();
    res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function submitReview(req, res)
{
  console.log("调用审核")
  try {
    const id = req.query.id;
    const data = req.body;
    const status = data.status;
    const remarks = data.remarks;
    const reviewDate = data.reviewDate;
    const reviewer = data.reviewer;
    const updatedData = {
      id,
      status,
      remarks,
      reviewDate,
      reviewer
    }
    await submitService.updateWithdrawalStatus(updatedData);
    res.status(200).json({
      success: true,
      message: "Withdrawal status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, error: "Internal server error" });
  }
}
module.exports = {
  fetchRecords,
  submitReview
}
