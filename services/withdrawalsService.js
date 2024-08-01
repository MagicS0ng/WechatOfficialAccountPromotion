const { format } = require("mysql");
const Submission = require("../models/Submission")
async function checkExpired(userId) {
  const formattedNow = (new Date()).toISOString();
  var expired_time = await Submission.PromotionInfo.findOne({
    where: {
      user_id: userId,
    },
  });
  expired_time =( new Date(expired_time.withdraw_expiry_date)).toISOString();
  if(expired_time < formattedNow)
    return true;
  return false;
}
async function checkPending(userId)
{
  try{
  const pending = await Submission.Withdrawals.findAll({
    where: {
      user_id: userId,
      status: "pending"
    },
  });
  return pending;
  } 
  catch(err)
  {
    console.log(err);
    throw new Error("checkPending error");
  }
}
module.exports = {
  checkExpired,
  checkPending
}