document.addEventListener('DOMContentLoaded', () => {
  console.log('Settings.js loaded');
  
  // Set up toggle password functionality
  setupPasswordToggle();
  
  // Set up profile picture upload functionality
  setupProfilePictureUpload();
  
  // Load user data to populate form fields
  loadUserData();
  
  // Set up form submission handlers
  setupFormHandlers();
});

function setupPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const inputField = document.getElementById(targetId);
      
      if (inputField.type === 'password') {
        inputField.type = 'text';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      } else {
        inputField.type = 'password';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      }
    });
  });
}

function setupProfilePictureUpload() {
  const imageInput = document.getElementById('file');
  const profileImage = document.getElementById('photo');
  
  if (imageInput && profileImage) {
    imageInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          profileImage.src = e.target.result;
          
          // Here you would typically upload the image to your server
          // uploadProfileImage(this.files[0]);
        };
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
}

function loadUserData() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    console.log('No token found, redirecting to login');
    window.location.href = '/HTML/login.html';
    return;
  }
  
  // First try to get data from localStorage for fast display
  const cachedUserData = localStorage.getItem('userData');
  if (cachedUserData) {
    try {
      const userData = JSON.parse(cachedUserData);
      populateUserData(userData);
    } catch (e) {
      console.error('Error parsing cached user data:', e);
    }
  }
  
  // Then fetch fresh data from the server
  fetch('/api/auth/user', {
    headers: {
      'x-auth-token': token
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Invalid token: ${response.status}`);
    }
    return response.json();
  })
  .then(userData => {
    console.log('User data received:', userData);
    
    // Save to localStorage for other pages
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Populate the form fields with user data
    populateUserData(userData);
  })
  .catch(err => {
    console.error('Failed to fetch user data:', err);
  });
}

function populateUserData(userData) {
  // Populate username field
  const usernameInput = document.querySelector('.top-bottom-left input[placeholder="Username"]');
  if (usernameInput && userData.username) {
    usernameInput.value = userData.username;
  }
  
  // Populate email field
  const emailInput = document.querySelector('.mid-email input[type="email"]');
  if (emailInput && userData.email) {
    emailInput.value = userData.email;
  }
  
  // Populate name fields if they exist in userData
  if (userData.firstName) {
    const firstNameInput = document.querySelector('.top-bottom-left input[placeholder="First Name"]');
    if (firstNameInput) {
      firstNameInput.value = userData.firstName;
    }
  }
  
  if (userData.lastName) {
    const lastNameInput = document.querySelector('.top-bottom-left input[placeholder="Last Name"]');
    if (lastNameInput) {
      lastNameInput.value = userData.lastName;
    }
  }
  
  // Update header username too (though general.js should handle this)
  updateHeaderUsername(userData.username);
}

function updateHeaderUsername(username) {
  if (!username) return;
  
  const usernameElement = document.querySelector('header .right-section h3');
  if (usernameElement) {
    usernameElement.textContent = username;
  }
}

function setupFormHandlers() {
  // Edit name button handler
  const editNameBtn = document.querySelector('.top-bottom button');
  if (editNameBtn) {
    editNameBtn.addEventListener('click', function() {
      const username = document.querySelector('.top-bottom-left input[placeholder="Username"]').value;
      const firstName = document.querySelector('.top-bottom-left input[placeholder="First Name"]').value;
      const lastName = document.querySelector('.top-bottom-left input[placeholder="Last Name"]').value;
      
      // Here you would typically update the user profile
      // updateUserProfile({ username, firstName, lastName });
      alert('This functionality will be implemented soon!');
    });
  }
  
  // Edit email button handler
  const editEmailBtn = document.getElementById('editemail');
  if (editEmailBtn) {
    editEmailBtn.addEventListener('click', function() {
      const email = document.querySelector('.mid-email input[type="email"]').value;
      
      // Here you would typically update the user email
      // updateUserEmail(email);
      alert('This functionality will be implemented soon!');
    });
  }
  
  // Edit password button handler
  const editPasswordBtn = document.getElementById('editpasswordbtn');
  if (editPasswordBtn) {
    editPasswordBtn.addEventListener('click', function() {
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if (newPassword !== confirmPassword) {
        alert('New password and confirm password must match!');
        return;
      }
      
      // Here you would typically update the user password
      // updateUserPassword(currentPassword, newPassword);
      alert('This functionality will be implemented soon!');
    });
  }
}

// Future implementation for these functions
function uploadProfileImage(file) {
  // Implementation for uploading profile picture
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', file);
  formData.append('category', 'profile');
  
  fetch('/api/images', {
    method: 'POST',
    headers: {
      'x-auth-token': token
    },
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Profile image uploaded:', data);
    // Update user profile with new image path
  })
  .catch(err => {
    console.error('Error uploading profile image:', err);
  });
}

function updateUserProfile(profileData) {
  // Implementation for updating user profile
}

function updateUserEmail(email) {
  // Implementation for updating user email
}

function updateUserPassword(currentPassword, newPassword) {
  // Implementation for updating user password
}