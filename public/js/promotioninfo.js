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
        document.getElementById("withdrawButton").addEventListener("click",  function () {
            var withdrawable_amount = result.userPromotionInfo.withdrawable_amount;
            if(withdrawable_amount<=0)
            {
                modal.style.display = "block";
            }
        });
        span.onclick = function() {
            modal.style.display = "none";
        }
        
        // 当用户点击模态框以外的区域时关闭模态框
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
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