const submitBtn = document.getElementById('submitSignup');
const msg = document.getElementById('signupMsg');

submitBtn.addEventListener('click', async () => {
  const name = document.getElementById('p_name').value;
  const email = document.getElementById('p_email').value;
  const phone = document.getElementById('p_phone').value;
  const token = localStorage.getItem('token');
  if (!token) {
    msg.textContent = '請先登入';
    return;
  }
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, email, phone })
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('登入資訊過期或無效，請重新登入');
      window.location.reload();
      return;
    }
    msg.textContent = data.error || '發生錯誤';
    return;
  }
  msg.textContent = '提交成功';
  window.location.reload();
});

// auto load list
async function loadList() {
  const token = localStorage.getItem('token');
  const ul = document.getElementById('participants');
  ul.innerHTML = '';
  if (!token) return;
  const res = await fetch('/api/signup', { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return;
  const data = await res.json();
  data.data.forEach((p) => {
    const li = document.createElement('li');
    li.textContent = `${p.name} - ${p.email} - ${p.phone}`;
    if (p._id) {
      const btn = document.createElement('button');
      btn.textContent = '刪除';
      btn.addEventListener('click', async () => {
        if (!confirm('確定要刪除？')) return;
        const token = localStorage.getItem('token');
        const r = await fetch(`/api/signup/${p._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        const j = await r.json();
        if (!r.ok) alert(j.error || '刪除失敗');
        else window.location.reload();
      });
      li.appendChild(btn);
    }
    ul.appendChild(li);
  });
}

loadList();
