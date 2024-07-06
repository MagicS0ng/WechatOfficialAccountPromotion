document.addEventListener('DOMContentLoaded', async function () {
  var urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  try {
      const response = await fetch(`/api/getuserpromotion?userId=${userId}`);
      if (response.ok) {
          const result = await response.json();
          document.getElementById('qrCodeImage').src = `/api/getQrCode/${userId}_qrcode.png`;
          document.getElementById('nickname').textContent = result.userInfo.nickname;
          document.getElementById('phoneNumber').textContent = result.userInfo.phone;
          document.getElementById('promotionCount').textContent = result.userPromotionInfo.promotion_count;
          document.getElementById('withdrawableAmount').textContent = result.userPromotionInfo.withdrawable_amount;
          document.getElementById('expire_time').textContent = result.diffDays;
      } else {
          document.getElementById('response').textContent = 'Error: ' + response.statusText;
      }
  } catch (error) {
      document.getElementById('response').textContent = 'Error: ' + error.message;
  }
});