document.getElementById('promotionForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const phone = event.target.phone.value;
    const receipt = event.target.receipt.value;
    const installationDate = event.target.installationDate.value;

    // 先检查手机号和收据是否存在
    try {
        const checkResponse = await fetch('/api/promotion/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, receipt })
        });

        const checkResult = await checkResponse.json();

        if (!checkResponse.ok) {
            document.getElementById('errorMessage').textContent = checkResult.error;
            document.getElementById('successMessage').textContent = '';
            return;
        }

        // 如果检查通过，则提交表单
        const response = await fetch('/api/promotion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, receipt, installationDate })
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('successMessage').textContent = result.message;
            document.getElementById('errorMessage').textContent = '';
        } else {
            document.getElementById('errorMessage').textContent = result.error;
            document.getElementById('successMessage').textContent = '';
        }
    } catch (error) {
        document.getElementById('errorMessage').textContent = 'An error occurred. Please try again.';
        document.getElementById('successMessage').textContent = '';
    }
});

function shakeAndHighlight(inputElement) {
    inputElement.style.borderColor = "red";
    inputElement.animate([
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0px)' }
    ], {
        duration: 150,
        iterations: 2
    }).onfinish = () => {
        inputElement.style.borderColor = ""; // 动画结束后恢复边框颜色
    };
}

function isChinesePhoneNumber(phone) {
    return /^1[3-9]\d{9}$/.test(phone);
}

const phoneInput = document.getElementById('promotionForm').elements['phone'];

phoneInput.addEventListener('blur', function() {
    if (!isChinesePhoneNumber(this.value)) {
        shakeAndHighlight(this);
    } else {
        this.style.borderColor = ""; // 格式正确时清除可能存在的红色边框
    }
});

document.getElementById('promotionForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (!isChinesePhoneNumber(phoneInput.value)) {
        shakeAndHighlight(phoneInput);
        alert('Please enter a valid phone number in the correct format.');
        return; // 阻止表单继续提交
    }

    const phone = event.target.phone.value;
    const receipt = event.target.receipt.value;
    const installationDate = event.target.installationDate.value;

    // 先检查手机号和收据是否存在
    try {
        const checkResponse = await fetch('/api/promotion/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, receipt })
        });

        const checkResult = await checkResponse.json();

        if (!checkResponse.ok) {
            document.getElementById('errorMessage').textContent = checkResult.error;
            document.getElementById('successMessage').textContent = '';
            return;
        }

        // 如果检查通过，则提交表单
        const response = await fetch('/api/promotion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, receipt, installationDate })
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('successMessage').textContent = result.message;
            document.getElementById('errorMessage').textContent = '';
        } else {
            document.getElementById('errorMessage').textContent = result.error;
            document.getElementById('successMessage').textContent = '';
        }
    } catch (error) {
        document.getElementById('errorMessage').textContent = 'An error occurred. Please try again.';
        document.getElementById('successMessage').textContent = '';
    }
});
