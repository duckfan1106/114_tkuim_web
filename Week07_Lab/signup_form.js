const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const successMessage = document.getElementById('success-message');
const strengthBar = document.getElementById('strength-bar');

// 儲存欄位內容到 localStorage
function saveToLocalStorage() {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        localStorage.setItem(input.id, input.value);
    });
}

// 從 localStorage 加載欄位內容
function loadFromLocalStorage() {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        const value = localStorage.getItem(input.id);
        if (value) {
            input.value = value;
        }
    });
}

// 清除 localStorage
function clearLocalStorage() {
    localStorage.clear();
}

function setError(input, message) {
    const error = document.getElementById(`${input.id}-error`);
    input.setCustomValidity(message);
    error.textContent = message;
    input.classList.toggle('is-invalid', message !== '');
}

function resetError(input) {
    const error = document.getElementById(`${input.id}-error`);
    input.setCustomValidity('');
    error.textContent = '';
    input.classList.remove('is-invalid');
}

function validateInput(input) {
    const value = input.value.trim();
    switch (input.id) {
        case 'name':
            if (!value) {
                setError(input, '姓名為必填欄位');
                return false;
            }
            break;
        case 'email':
            if (!value) {
                setError(input, 'Email為必填欄位');
                return false;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                setError(input, 'Email格式不正確');
                return false;
            }
            break;
        case 'phone':
            if (!value.match(/^\d{10}$/)) {
                setError(input, '手機必須是10碼數字');
                return false;
            }
            break;
        case 'password':
            if (value.length < 8) {
                setError(input, '密碼至少要8碼');
                return false;
            }
            if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
                setError(input, '密碼必須包含英文字母和數字');
                return false;
            }
            break;
        case 'confirm-password':
            const password = document.getElementById('password').value;
            if (value !== password) {
                setError(input, '確認密碼必須與密碼一致');
                return false;
            }
            break;
    }
    resetError(input);
    return true;
}

function validateForm() {
    const inputs = form.querySelectorAll('input');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    const interests = form.querySelectorAll('#interests input[type="checkbox"]:checked');
    if (interests.length === 0) {
        const error = document.getElementById('interests-error');
        error.textContent = '至少勾選一個興趣標籤';
        isValid = false;
    } else {
        document.getElementById('interests-error').textContent = '';
    }

    const terms = document.getElementById('terms');
    if (!terms.checked) {
        setError(terms, '必須同意服務條款');
        isValid = false;
    } else {
        resetError(terms);
    }

    return isValid;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm()) {
        const firstInvalid = form.querySelector('input:invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '送出中...';

    await new Promise(resolve => setTimeout(resolve, 1000));
    successMessage.textContent = '註冊成功！感謝您的註冊！';

    // 提示用戶表單已成功送出
    alert('表單已成功送出！');

    // 清空
    form.reset();
    clearLocalStorage(); // 清除 localStorage
    strengthBar.className = 'strength-bar';
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';

    // 自動隱藏成功消息
    setTimeout(() => {
        successMessage.textContent = '';
    }, 3000);
});

// 重設按鈕事件
resetBtn.addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
    strengthBar.className = 'strength-bar';
    clearLocalStorage(); // 清除 localStorage
});

// 密碼強度檢查
const passwordInput = document.getElementById('password');
passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    let strength = 'weak';
    if (value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value)) {
        strength = 'strong';
    } else if (value.length >= 6) {
        strength = 'medium';
    }
    strengthBar.className = `strength-bar strength-${strength}`;
});

// 即時驗證
form.addEventListener('blur', (event) => {
    if (event.target.matches('input')) {
        validateInput(event.target);
    }
}, true);

// 加載 localStorage 的內容
loadFromLocalStorage();

// 監聽輸入事件以保存到 localStorage
const inputs = form.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', saveToLocalStorage);
});
