document.getElementsByName("installationDate")[0].max = new Date().toISOString().split("T")[0];
document
  .getElementById("promotionForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const url =  new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const userId = params.get("userId");
    const phone = event.target.phone.value;
    const receipt = event.target.receipt.value;
    const installationDate = event.target.installationDate.value;
    // 先检查手机号和收据是否存在
    try {
      const checkResponse = await fetch("/api/promotionrecord/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receipt }),
      });

      const checkResult = await checkResponse.json();

      if (!checkResponse.ok) {
        document.getElementById("errorMessage").textContent = checkResult.error;
        document.getElementById("successMessage").textContent = "";
        return;
      }

      // 如果检查通过，则提交表单
      const response = await fetch(`/api/promotionrecord`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userId, phone, receipt, installationDate }),
      });

      const result = await response.json();

      if (response.ok) {
        document.getElementById("successMessage").textContent = result.message;
        document.getElementById("errorMessage").textContent = result.message;
        // window.location.href = result.redirect;
      } else {
        document.getElementById("errorMessage").textContent = result.error;
        document.getElementById("successMessage").textContent = "";
      }
    } catch (error) {
      document.getElementById("errorMessage").textContent = 
        "An error occurred. Please try again.";
      document.getElementById("successMessage").textContent = "";
    }
  });

function shakeAndHighlight(inputElement) {
  inputElement.style.borderColor = "red";
  inputElement.animate(
    [
      { transform: "translateX(10px)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(0px)" },
    ],
    {
      duration: 150,
      iterations: 2,
    }
  ).onfinish = () => {
    inputElement.style.borderColor = ""; // 动画结束后恢复边框颜色
  };
}

function isChinesePhoneNumber(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}

const phoneInput = document.getElementById("promotionForm").elements["phone"];

phoneInput.addEventListener("blur", function () {
  if (!isChinesePhoneNumber(this.value)) {
    document.getElementById("message").textContent = "请输入正确格式的手机号";
    shakeAndHighlight(this);
  } else {
    document.getElementById("message").textContent="";
    this.style.borderColor = ""; // 格式正确时清除可能存在的红色边框
  }
});
