// practice6_dynamic_fields.js
// 動態新增報名欄位並整合事件委派、即時驗證與送出攔截

const form = document.getElementById('dynamic-form');
const list = document.getElementById('participant-list');
const addBtn = document.getElementById('add-participant');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const countLabel = document.getElementById('count');

const maxParticipants = 5;
let participantIndex = 0;

// 從 localStorage 恢復參與者資料
function loadParticipants() {
  const participants = JSON.parse(localStorage.getItem('participants')) || [];
  participants.forEach(() => handleAddParticipant());
  participants.forEach((participant, index) => {
    const nameInput = document.getElementById(`name-${index}`);
    const emailInput = document.getElementById(`email-${index}`);
    if (nameInput) nameInput.value = participant.name;
    if (emailInput) emailInput.value = participant.email;
  });
  updateCount();
}

function createParticipantCard() {
  const index = participantIndex++;
  const wrapper = document.createElement('div');
  wrapper.className = 'participant card border-0 shadow-sm';
  wrapper.dataset.index = index;
  wrapper.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h5 class="card-title mb-0">參與者 ${index + 1}</h5>
        <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove">移除</button>
      </div>
      <div class="mb-3">
        <label class="form-label" for="name-${index}">姓名</label>
        <input id="name-${index}" name="name-${index}" class="form-control" type="text" required aria-describedby="name-${index}-error">
        <p id="name-${index}-error" class="text-danger small mb-0" aria-live="polite"></p>
      </div>
      <div class="mb-0">
        <label class="form-label" for="email-${index}">Email</label>
        <input id="email-${index}" name="email-${index}" class="form-control" type="email" required aria-describedby="email-${index}-error" inputmode="email">
        <p id="email-${index}-error" class="text-danger small mb-0" aria-live="polite"></p>
      </div>
    </div>
  `;
  return wrapper;
}

function updateCount() {
  countLabel.textContent = list.children.length;
  addBtn.disabled = list.children.length >= maxParticipants;
}

function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  input.setCustomValidity(message);
  error.textContent = message;
  if (message) {
    input.classList.add('is-invalid');
    input.style.borderColor = 'red'; // 增強視覺提示
  } else {
    input.classList.remove('is-invalid');
    input.style.borderColor = ''; // 恢復默認邊框顏色
  }
}

function validateInput(input) {
  const value = input.value.trim();
  if (!value) {
    setError(input, '此欄位必填');
    return false;
  }
  if (input.type === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setError(input, 'Email 格式不正確');
      return false;
    }
  }
  setError(input, '');
  return true;
}

function handleAddParticipant() {
  if (list.children.length >= maxParticipants) {
    return;
  }
  const participant = createParticipantCard();
  list.appendChild(participant);
  updateCount();
  participant.querySelector('input').focus();
}

addBtn.addEventListener('click', handleAddParticipant);

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="remove"]');
  if (!button) {
    return;
  }
  const participant = button.closest('.participant');
  participant?.remove();
  updateCount();
});

list.addEventListener('blur', (event) => {
  if (event.target.matches('input')) {
    validateInput(event.target);
  }
}, true);

list.addEventListener('input', (event) => {
  if (event.target.matches('input')) {
    const wasInvalid = event.target.validationMessage;
    if (wasInvalid) {
      validateInput(event.target);
    }
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (list.children.length === 0) {
    alert('請至少新增一位參與者');
    handleAddParticipant();
    return;
  }

  let firstInvalid = null;
  const participants = [];
  list.querySelectorAll('input').forEach((input) => {
    const valid = validateInput(input);
    if (!valid && !firstInvalid) {
      firstInvalid = input;
    } else {
      participants.push({
        name: input.name,
        email: input.value,
      });
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';
  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('表單已送出！');
  
  // 儲存參與者資料到 localStorage
  localStorage.setItem('participants', JSON.stringify(participants));

  form.reset();
  list.innerHTML = '';
  participantIndex = 0;
  updateCount();
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  list.innerHTML = '';
  participantIndex = 0;
  updateCount();
  localStorage.removeItem('participants'); // 清除 localStorage
});

// 匯出名單
const exportBtn = document.createElement('button');
exportBtn.textContent = '匯出名單';
exportBtn.className = 'btn btn-info mt-3';
exportBtn.addEventListener('click', () => {
  const participants = [];
  list.querySelectorAll('.participant').forEach((participant) => {
    const nameInput = participant.querySelector('input[type="text"]');
    const emailInput = participant.querySelector('input[type="email"]');
    participants.push({
      name: nameInput.value,
      email: emailInput.value,
    });
  });
  const json = JSON.stringify(participants, null, 2);
  alert(`目前名單:\n${json}`);
});
form.appendChild(exportBtn);

// 預設新增一筆，方便學生立即觀察互動
handleAddParticipant();
loadParticipants(); // 載入參與者資料
