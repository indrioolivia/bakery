// CAPTCHA state
let captchaText = '';

// Auth Modal Controller
export function showAuthModal(mode) {
  const modal = document.getElementById('auth-modal');
  const title = document.getElementById('auth-title');
  const signinForm = document.getElementById('signinForm');
  const registerForm = document.getElementById('registerForm');

  if (mode === 'signin') {
    title.textContent = 'Sign In';
    signinForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    generateCaptcha();
  } else {
    title.textContent = 'Register';
    signinForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }

  modal.showModal();
}

// CAPTCHA Generator
export function generateCaptcha() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  captchaText = '';
  
  for (let i = 0; i < 6; i++) {
    captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const captchaElement = document.getElementById('captchaText');
  if (captchaElement) {
    captchaElement.textContent = captchaText;
  }
}

// Handle Sign In
export function handleSignIn(event) {
  event.preventDefault();
  
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;
  const captchaInput = document.getElementById('captchaInput').value;

  // Verify CAPTCHA
  if (captchaInput !== captchaText) {
    showToast('Invalid CAPTCHA! Please try again.');
    generateCaptcha();
    document.getElementById('captchaInput').value = '';
    return;
  }

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    handleLogin(user);
    document.getElementById('auth-modal').close();
    showToast('Successfully signed in!');
  } else {
    showToast('Invalid email or password!');
    generateCaptcha();
    document.getElementById('captchaInput').value = '';
  }
}

// Handle Register
export function handleRegister(event) {
  event.preventDefault();
  
  // Get all form values
  const userData = {
    name: document.getElementById('registerName').value,
    email: document.getElementById('registerEmail').value,
    password: document.getElementById('registerPassword').value,
    phone: document.getElementById('registerPhone').value,
    address: {
      address_line: document.getElementById('registerAddressLine').value,
      city: document.getElementById('registerCity').value,
      state: document.getElementById('registerState').value,
      postal_code: document.getElementById('registerPostalCode').value,
      country: document.getElementById('registerCountry').value
    }
  };

  // Get existing users
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {
    showToast('Email already registered!', 'error');
    return;
  }

  // Add new user
  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));

  // Auto login after register
  handleLogin(userData);
  document.getElementById('auth-modal').close();
  showToast('Registration successful!', 'success');
}

// Handle Login (update UI)
export function handleLogin(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // Update UI
  document.getElementById('signedOutItems').classList.add('hidden');
  document.getElementById('signedInItems').classList.remove('hidden');
  document.getElementById('profileName').textContent = user.name;
}

// Handle Logout
export function handleLogout() {
  localStorage.removeItem('currentUser');
  
  // Update UI
  document.getElementById('signedOutItems').classList.remove('hidden');
  document.getElementById('signedInItems').classList.add('hidden');
  showToast('Successfully logged out!');
}

// Toast Notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-end';
  toast.innerHTML = `
    <div class="alert alert-info">
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
} 