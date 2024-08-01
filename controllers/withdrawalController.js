const sequelize = require("../config/database");
const Submission = require("../models/Submission");
const { checkExpired, checkPending } = require("../services/withdrawalsService");
async function handleisExistPendingWithdraw(req, res) { //查看当前userId下有没有审核中的提现记录
  const userId = req.query.userId;
  const isExpired = await checkExpired(userId);
  if(isExpired)
  {
    res.status(200).json({
      isExpired: true,
      isExist: false,
      message: "该用户不存在正在进行中的提现申请（提现已过期）",
    });
    return ;
  }
  try {
    const isExistPending = await checkPending(userId);
    if(isExistPending.length!=0)
    {
      res.status(200).json({
        isExpired:false,
        isExist: true,
        message: "该用户存在正在进行中的提现申请",
        // isExistPending,
      });
      return;
    }
    res.status(200).json({
      isExpired:false,
      isExist: false,
      message: "该用户不存在正在进行中的提现申请",
      // isExistPending,
    });
  } catch (error) {
    res.status(500).json(
      { error: "Internal Server Error" }
    )
    console.log(error);
  }
}
// async function handleWithdrawRecords(req, res)
// {
//   let transaction;
//   try {
//     const userId = req.params.userId;
//     transaction = await sequelize.transaction();
//     const records = Submission.Withdrawals.findAll(
//       { where: { user_id: userId, status: ['approved', 'rejected', 'expired'] } }, { transaction }
//     )
//     if(records)
//     {
//       res.status(200).json({
//         success: true,
//         message: "该用户的所有已经完成的提现记录",
//         isExistPending,
//       });
//     }
//     transaction.commit();
//   } catch (error) {
//     if(transaction)
//       transaction.rollback();
//     console.log(error);
//   }
// }
async function handlesubmitWithdrawl(req, res)
{
  let transaction;
  try {
    const userId = req.query.userId;
    const isExistPending = await checkPending(userId);
    if(isExistPending.length!=0)
    {
      res.status(200).json({
        success: false,
        message: "该用户存在正在进行中的提现申请",
        isExist: true,
      });
      return ;
    }
    transaction = await sequelize.transaction();
    var amount = await Submission.PromotionInfo.findOne(
      { where: { user_id: userId } }, { transaction }
    )
    amount = amount.withdrawable_amount;
    const submitwithdrawal = await Submission.Withdrawals.create(
      { 
        user_id: userId, 
        amount: amount,
        status: "pending" 
      }, { transaction }
    );
    res.status(200).json({
      success: true,
      message: "提现申请提交成功",
      submitwithdrawal,
    });
    transaction.commit();
  } catch (error) {
    if(transaction)
      transaction.rollback();
    res.status(500).json(
      { error: "Internal Server Error" }
    );
    console.log(error);
  }
}
module.exports =
{
  handleisExistPendingWithdraw,
  // handleWithdrawRecords,
  handlesubmitWithdrawl
}