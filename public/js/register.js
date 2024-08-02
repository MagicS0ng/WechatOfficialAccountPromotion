document.getElementById('admin-register-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const authorizationCode = document.getElementById('authorization-code').value;

  if (password !== confirmPassword) {
    alert('密码和确认密码不一致');
    return;
  }

  // 发送 AJAX 请求到服务器注册管理员
  fetch('/admin/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, authorizationCode })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('注册成功');
      window.location.href = '/admin/login'; // 跳转到登录页面
    } else {
      alert('注册失败，请检查信息或授权码');
    }
  })
  .catch(error => console.error('Error:', error));
});