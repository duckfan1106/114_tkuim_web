const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginMsg = document.getElementById('loginMsg');

function setUser(user) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    loginMsg.textContent = `已登入：${user.email} (${user.role})`;
  } else {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    loginMsg.textContent = '未登入';
  }
}

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    setUser(null);
    alert(data.error || '登入失敗');
    return;
  }
  localStorage.setItem('token', data.token);
  setUser(data.user);
  alert('登入成功');
  window.location.reload();
});

logoutBtn.addEventListener('click', () => {
  setUser(null);
  window.location.reload();
});

// init
const user = localStorage.getItem('user');
setUser(user ? JSON.parse(user) : null);
