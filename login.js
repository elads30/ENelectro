// Tab switching logic
function switchTab(tab) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  if (tab === 'login') {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}

// Toast helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' 
    ? `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    : `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Handle login submission
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  const users = JSON.parse(localStorage.getItem('enelectro_users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    sessionStorage.setItem('enelectro_session', JSON.stringify({
      email: user.email,
      name: user.name
    }));
    showToast(`ברוך הבא, ${user.name}! מתחבר לחנות...`, 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  } else {
    showToast('אימייל או סיסמה אינם נכונים', 'error');
  }
}

// Handle registration submission
function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim().toLowerCase();
  const password = document.getElementById('register-password').value;

  const users = JSON.parse(localStorage.getItem('enelectro_users')) || [];
  const userExists = users.some(u => u.email === email);

  if (userExists) {
    showToast('משתמש עם כתובת אימייל זו כבר קיים במערכת', 'error');
    return;
  }

  // Create new user
  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem('enelectro_users', JSON.stringify(users));

  // Set current session
  sessionStorage.setItem('enelectro_session', JSON.stringify({
    email: newUser.email,
    name: newUser.name
  }));

  showToast('ההרשמה בוצעה בהצלחה! מעביר לחנות...', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1200);
}

// Initial configuration
window.addEventListener('DOMContentLoaded', () => {
  // If user is already logged in, redirect straight to store
  const session = sessionStorage.getItem('enelectro_session');
  if (session) {
    window.location.href = 'index.html';
  }
  
  // Seed a default admin/test user if database is empty
  const users = JSON.parse(localStorage.getItem('enelectro_users')) || [];
  if (users.length === 0) {
    users.push({
      name: "משתמש בדיקה",
      email: "test@enelectro.co.il",
      password: "password123"
    });
    localStorage.setItem('enelectro_users', JSON.stringify(users));
  }
});
