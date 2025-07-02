// Registration form submit handler
const registerForm = document.querySelector('.modal-form');
if (registerForm) {
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    // Get form values
    const email = document.getElementById('modal-email').value;
    const username = email.split('@')[0]; // username from email
    const password = document.getElementById('modal-password').value;

    // Send POST request to Django API
    const response = await fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (response.ok) {
      alert('Registration successful! You can now log in.');
      // Optionally, close modal or switch to login modal
    } else {
      const data = await response.json();
      alert('Registration failed: ' + JSON.stringify(data));
    }
  });
}

// Login form submit handler
const loginForm = document.querySelector('#loginModal .modal-form');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: identifier, password })
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      showNotification('Login successful!');
      fetchProfileAndUpdateUI();
      // Hide login modal
      const loginModal = document.getElementById('loginModal');
      if (loginModal) loginModal.style.display = 'none';
      document.body.classList.remove('modal-blur');
      document.documentElement.classList.remove('modal-blur');
    } else {
      const data = await response.json();
      alert('Login failed: ' + JSON.stringify(data));
    }
  });
}

function showUserUI(username) {
  const userInfo = document.getElementById('user-info');
  const logoutBtn = document.getElementById('logout-btn');
  if (userInfo) userInfo.textContent = username ? `Welcome, ${username}` : '';
  if (logoutBtn) logoutBtn.style.display = username ? '' : 'none';
}

function hideUserUI() {
  const userInfo = document.getElementById('user-info');
  const logoutBtn = document.getElementById('logout-btn');
  if (userInfo) userInfo.textContent = '';
  if (logoutBtn) logoutBtn.style.display = 'none';
}

async function fetchProfileAndUpdateUI() {
  const token = localStorage.getItem('access');
  if (!token) {
    hideUserUI();
    return;
  }
  try {
    const res = await fetch('http://127.0.0.1:8000/api/profile/', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Unauthorized');
    const data = await res.json();
    showUserUI(data.username);
  } catch {
    hideUserUI();
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    hideUserUI();
    showNotification('Logged out!');
  });
}

// Show user info on page load
fetchProfileAndUpdateUI();

// Show Edit User Modal on user icon click
const userIcon = document.getElementById('user-icon');
const editUserModal = document.getElementById('editUserModal');
const accountModal = document.getElementById('accountModal');
const closeEditUserModal = document.getElementById('closeEditUserModal');

if (userIcon) {
  userIcon.addEventListener('click', async function(e) {
    e.preventDefault();
    if (editUserModal) editUserModal.style.display = 'none';
    if (accountModal) accountModal.style.display = 'none';
    const token = localStorage.getItem('access');
    if (token) {
      if (editUserModal) {
        const res = await fetch('http://127.0.0.1:8000/api/profile/', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
          const data = await res.json();
          document.getElementById('edit-username').value = data.username;
          document.getElementById('edit-email').value = data.email;
          showUserUI(data.username);
        } else {
          hideUserUI();
        }
        editUserModal.style.display = 'flex';
      }
    } else {
      if (accountModal) accountModal.style.display = 'flex';
    }
  });
}
if (closeEditUserModal) {
  closeEditUserModal.addEventListener('click', function() {
    if (editUserModal) editUserModal.style.display = 'none';
    if (accountModal) accountModal.style.display = 'none';
    document.body.classList.remove('modal-blur');
    document.documentElement.classList.remove('modal-blur');
  });
}

// Save changes (PUT request)
const editUserForm = document.getElementById('edit-user-form');
if (editUserForm) {
  editUserForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const username = document.getElementById('edit-username').value;
    const email = document.getElementById('edit-email').value;
    const res = await fetch('http://127.0.0.1:8000/api/profile/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ username, email })
    });
    if (res.ok) {
      alert('Profile updated!');
      editUserModal.style.display = 'none';
      fetchProfileAndUpdateUI();
    } else {
      alert('Failed to update profile.');
    }
  });
}

const changePasswordForm = document.getElementById('change-password-form');
if (changePasswordForm) {
  changePasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('access');
    const old_password = document.getElementById('old-password').value;
    const new_password = document.getElementById('new-password').value;
    const res = await fetch('http://127.0.0.1:8000/api/change-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ old_password, new_password })
    });
    if (res.ok) {
      alert('Password changed successfully!');
      changePasswordForm.reset();
    } else {
      const data = await res.json();
      alert('Failed to change password: ' + (data.detail || JSON.stringify(data)));
    }
  });
}

// Google Login
window.onload = function() {
  const googleBtn = document.getElementById('google-login-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      google.accounts.id.initialize({
        client_id: '638521072568-bffpaaibv02vd0dls3hlfihphaeo0ts3.apps.googleusercontent.com', // <-- Replace with your real client ID
        callback: async function(response) {

          const res = await fetch('http://127.0.0.1:8000/dj-rest-auth/google/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: response.credential })
          });
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            alert('Google login successful!');
            fetchProfileAndUpdateUI();
          } else {
            alert('Google login failed.');
          }
        }
      });
      google.accounts.id.prompt(); // Show the Google login popup
    });
  }
};

// Facebook Login
window.fbAsyncInit = function() {
  FB.init({
    appId      : '1964212387450708', // <-- Replace with your real Facebook App ID
    cookie     : true,
    xfbml      : true,
    version    : 'v19.0'
  });
};

const facebookBtn = document.getElementById('facebook-login-btn');
if (facebookBtn) {
  facebookBtn.addEventListener('click', function(e) {
    e.preventDefault();
    FB.login(async function(response) {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        // Send the token to your backend
        const res = await fetch('http://127.0.0.1:8000/dj-rest-auth/facebook/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          alert('Facebook login successful!');
          fetchProfileAndUpdateUI();
        } else {
          alert('Facebook login failed.');
        }
      } else {
        alert('Facebook login cancelled or failed.');
      }
    }, {scope: 'email'});
  });
}

function showNotification(message, duration=2000) {
  const notif = document.getElementById('notification');
  if (!notif) return;
  notif.textContent = message;
  notif.style.display = 'block';
  notif.style.opacity = '1';
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => { notif.style.display = 'none'; }, 400);
  }, duration);
} 