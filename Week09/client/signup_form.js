const API_URL = 'http://localhost:3001/api/signup';
const form = document.querySelector('#signup-form');
const submitBtn = document.querySelector('#submit-btn');
const loadingSpinner = document.querySelector('#loading-spinner');
const resultEl = document.querySelector('#result');
const viewListBtn = document.querySelector('#view-list-btn');
const listResultEl = document.querySelector('#list-result');

let isSubmitting = false;

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (isSubmitting) return;

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  
  payload.terms = formData.has('terms'); 
  payload.interests = ['後端入門']; 

  isSubmitting = true;
  submitBtn.disabled = true;
  loadingSpinner.style.display = 'inline-block';
  resultEl.textContent = '送出中...';
  resultEl.classList.remove('text-success', 'text-danger');

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    
    if (res.ok) {
      resultEl.classList.add('text-success');
      resultEl.textContent = `✅ 報名成功！ ${data.message}\n\n${JSON.stringify(data.data, null, 2)}`;
      form.reset(); 
    } else {
      resultEl.classList.add('text-danger');
      const errorMessage = data.message || data.error || 'Unknown error';
      const detailErrors = data.errors ? `\n\n詳細錯誤：\n${data.errors.join('\n')}` : '';
      throw new Error(`報名失敗 (HTTP ${res.status})：${errorMessage}${detailErrors}`);
    }

  } catch (error) {
    resultEl.classList.add('text-danger');
    resultEl.textContent = `❌ Error: ${error.message}`;
  } finally {
    isSubmitting = false;
    submitBtn.disabled = false;
    loadingSpinner.style.display = 'none';
  }
});


viewListBtn.addEventListener('click', async () => {
    listResultEl.textContent = '載入報名清單中...';
    viewListBtn.disabled = true;

    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        if (res.ok) {
            listResultEl.textContent = JSON.stringify(data, null, 2);
        } else {
            listResultEl.textContent = `載入失敗 (HTTP ${res.status}): ${data.message || data.error || 'Unknown error'}`;
        }
    } catch (error) {
        listResultEl.textContent = `網路錯誤或伺服器無法連線：${error.message}`;
    } finally {
        viewListBtn.disabled = false;
    }
});