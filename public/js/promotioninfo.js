document.addEventListener("DOMContentLoaded", async function () {
  var urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId");
  var modal = document.getElementById('withdrawModal');
  // 获取关闭按钮
  var span = document.getElementsByClassName('close')[0];
  if (userId) {
    try {
      const response = await fetch(`/api/getuserpromotion?userId=${userId}`);
      if (response.ok) {
        const result = await response.json();
        document.getElementById(
          "qrCodeImage"
        ).src = `/api/getQrCode/${userId}_qrcode.png`;
        document.getElementById("nickname").textContent =
          result.userInfo.nickname;
        document.getElementById("phoneNumber").textContent =
          result.userInfo.phone;
        document.getElementById("promotionCount").textContent =
          result.userPromotionInfo.promotion_count;
        document.getElementById("withdrawableAmount").textContent =
          result.userPromotionInfo.withdrawable_amount;
        document.getElementById("expire_time").textContent = result.diffDays;
        document.getElementById("withdrawButton").addEventListener("click", function () {
          handleWithdrawRequest(result.userPromotionInfo.withdrawable_amount);
        });
        
      } else {
        document.getElementById("response").textContent =
          "Error: " + response.statusText;
      }
    } catch (error) {
      document.getElementById("response").textContent =
        "Error: " + error.message;
    }
  } else {
    document.getElementById("response").textContent = "无效用户";
  }
});
function setProgressVisible()
{
  var progressDiv = document.querySelectorAll('.hidden');
  progressDiv.forEach(function(div){div.classList.toggle('hidden')})
}
function handleWithdrawRequest(withdrawableAmount) {
  var modal = document.getElementById('withdrawModal');
  if (withdrawableAmount <= 0) {
    // showModal("当前不可提现，您的账户余额不足。");
    showModal("当前不可提现，您的账户余额不足。");
    return ;
  } 
  if (withdrawableAmount < 100) {
    // showModal("可提现金额满一百可提现");
    showModal("可提现金额满一百可提现");
    return ;
  }
  setProgressVisible();
  /** TODO
   * 1. 若满足提现要求，向后端发送提现请求
   * 2. 后端返回结果，设置提现状态，同时后端发送一条信息到公众号管理员，通知管理员提现
   * 3. 前端根据结果显示提现状态
   * 4. 管理员审核通过，后端向前端发送审核成功或失败，更新提现状态，若成功则调用api提现，
   */
}

显示模态框并设置提醒文本
function showModal(reminderText) {
  var modal = document.getElementById('withdrawModal');
  var span = document.getElementsByClassName('close')[0];
  document.getElementById("reminder").textContent = reminderText;
  modal.style.display = "block";

  // 关闭模态框
  span.onclick = function() {
    modal.style.display = "none";
  }

  // 当用户点击模态框以外的区域时关闭模态框
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
function updateWithdrawStatus(statusId) {
  const statuses = ['initiateWithdraw', 'reviewWithdraw', 'successWithdraw', 'failureWithDraw'];
  statuses.forEach(id => {
      document.getElementById(id).style.backgroundColor = (id === statusId) ? '#4CAF50' : '#fff';
  });
}

function addWithdrawRecord(record) {
  const recordList = document.getElementById('withdrawRecordsList');
  const listItem = document.createElement('li');
  listItem.textContent = `提现金额：${record.amount} 元，时间：${record.date}`;
  recordList.appendChild(listItem);
}



// 添加关闭模态框的功能
document.querySelector('.close').addEventListener('click', function() {
  document.getElementById('withdrawModal').style.display = 'none';
});