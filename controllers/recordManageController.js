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
module.exports = {
  fetchRecords
}
