document.getElementById('admin-login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // 这里应该发送 AJAX 请求到服务器验证管理员信息
  // 假设我们使用 fetch API 发送请求
  fetch('/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('登录成功');
      window.location.href = '/admin/dashboard'; // 跳转到管理员仪表盘
    } else {
      alert('登录失败，请检查用户名或密码');
    }
  })
  .catch(error => console.error('Error:', error));
});