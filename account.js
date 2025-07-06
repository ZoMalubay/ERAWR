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
  if (userInfo) userInfo.textContent = username ? `Welcome, ${username}` : '';
}

function hideUserUI() {
  const userInfo = document.getElementById('user-info');
  if (userInfo) userInfo.textContent = '';
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



// Show user info on page load
fetchProfileAndUpdateUI();

// Show Edit User Modal on user icon click
const userIcon = document.getElementById('user-icon');
const editUserModal = document.getElementById('editUserModal');
const accountModal = document.getElementById('accountModal');
const closeEditUserModal = document.getElementById('closeEditUserModal');
const loginModal = document.getElementById('loginModal');

if (userIcon) {
  userIcon.addEventListener('click', async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('access');
    if (token) {
      // If on profile page, do nothing; otherwise, go to profile page
      if (!window.location.pathname.endsWith('profile.html')) {
        window.location.href = 'profile.html';
      }
    } else {
      // Not logged in: open register/login modal as before
      if (editUserModal) editUserModal.style.display = 'none';
      if (accountModal) accountModal.style.display = 'flex';
      if (loginModal) loginModal.style.display = 'none';
      document.body.classList.add('modal-blur');
      document.documentElement.classList.add('modal-blur');
    }
  });
}

// Utility function to close all modals and remove blur
function closeAllModals() {
  if (editUserModal) editUserModal.style.display = 'none';
  if (accountModal) accountModal.style.display = 'none';
  if (loginModal) loginModal.style.display = 'none';
  document.body.classList.remove('modal-blur');
  document.documentElement.classList.remove('modal-blur');
}

if (closeEditUserModal) {
  closeEditUserModal.addEventListener('click', closeAllModals);
}
if (editUserModal) {
  editUserModal.addEventListener('click', function(e) {
    if (e.target === editUserModal) closeAllModals();
  });
}
if (accountModal) {
  accountModal.addEventListener('click', function(e) {
    if (e.target === accountModal) closeAllModals();
  });
}
if (loginModal) {
  loginModal.addEventListener('click', function(e) {
    if (e.target === loginModal) closeAllModals();
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