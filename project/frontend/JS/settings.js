document.addEventListener('DOMContentLoaded', () => {
  console.log('Settings.js loaded');
  
  //Set up toggle password functionality
  setupPasswordToggle();
  
  //Set up profile picture upload functionality
  setupProfilePictureUpload();
  
  //Load user data to populate form fields
  loadUserData();
  
  //Set up form submission handlers
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
  const saveSettingsBtn = document.getElementById('saveSettings');
  let imageChanged = false;
  let newImageData = null;
  
  //First, load existing profile picture if available
  loadExistingProfilePicture(profileImage);
  
  if (imageInput && profileImage) {
    imageInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        
        //Check file type
        if (!file.type.match('image/(jpeg|png)')) {
          alert('Please upload a JPEG or PNG image');
          this.value = ''; //Clear the input
          return;
        }
        
        //Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB');
          this.value = ''; //Clear the input
          return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
          //Display preview
          profileImage.src = e.target.result;
          
          //Mark that the image has been changed
          imageChanged = true;
          newImageData = e.target.result;
          
          //Update header profile picture immediately for preview
          const headerProfilePic = document.querySelector('header .right-section .pfp');
          if (headerProfilePic) {
            headerProfilePic.src = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  //Handle save settings button click - now updates ALL settings at once
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', async function() {
      try {
        //Disable the button to prevent multiple clicks
        saveSettingsBtn.disabled = true;
        saveSettingsBtn.textContent = 'Saving...';
        
        //Get all form data
        const firstName = document.querySelector('.top-bottom-left input[placeholder="First Name"]')?.value || '';
        const lastName = document.querySelector('.top-bottom-left input[placeholder="Last Name"]')?.value || '';
        const currentEmail = document.querySelector('.mid-email input[type="email"]')?.value || '';
        const newEmail = document.getElementById('new-email')?.value || '';
        const currentPassword = document.getElementById('current-password')?.value || '';
        const newPassword = document.getElementById('new-password')?.value || '';
        const confirmPassword = document.getElementById('confirm-password')?.value || '';
        
        console.log('Saving user settings...');
        
        //Validate name fields
        if (!firstName || !lastName) {
          alert('Please enter both first name and last name');
          saveSettingsBtn.disabled = false;
          saveSettingsBtn.textContent = 'Save Settings';
          return;
        }
        
        //Create an object to store all user data
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.profile) userData.profile = {};
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        //Track if we need to log out after saving
        let needsLogout = false;
        
        //1. First, handle password update if needed
        if (currentPassword && newPassword && confirmPassword === newPassword) {
          try {
            console.log('Updating password...');
            const passwordResponse = await fetch('/api/auth/change-password', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
              },
              body: JSON.stringify({
                currentPassword,
                newPassword
              })
            });
            
            const passwordData = await passwordResponse.json();
            
            if (!passwordResponse.ok) {
              throw new Error(passwordData.message || 'Failed to update password');
            }
            
            console.log('Password updated successfully');
            needsLogout = true;
          } catch (passwordError) {
            console.error('Error updating password:', passwordError);
            alert(passwordError.message || 'Failed to update password. Please check your current password and try again.');
            saveSettingsBtn.disabled = false;
            saveSettingsBtn.textContent = 'Save Settings';
            return;
          }
        }
        
        //2. Update name on the server
        try {
          console.log('Saving name to server:', { firstName, lastName });
          const nameResponse = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              firstName,
              lastName
            })
          });
          
          if (!nameResponse.ok) {
            throw new Error('Failed to update profile on server');
          }
          
          const profileData = await nameResponse.json();
          console.log('Profile updated on server:', profileData);
          
          //Update userData with response from server
          userData.profile = {...userData.profile, ...profileData};
        } catch (nameError) {
          console.error('Error saving name to server:', nameError);
        }
        
        //3. Update in localStorage
        userData.profile.firstName = firstName;
        userData.profile.lastName = lastName;
        userData.firstName = firstName;
        userData.lastName = lastName;
        
        //4. Handle email update if needed
        if (newEmail && currentEmail !== newEmail) {
          try {
            console.log('Updating email...');
            const emailResponse = await fetch('/api/auth/change-email', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
              },
              body: JSON.stringify({
                currentEmail,
                newEmail
              })
            });
            
            const emailData = await emailResponse.json();
            
            if (!emailResponse.ok) {
              throw new Error(emailData.message || 'Failed to update email');
            }
            
            console.log('Email updated successfully');
            needsLogout = true;
          } catch (emailError) {
            console.error('Error updating email:', emailError);
            alert(emailError.message || 'Failed to update email');
          }
        }
        
        //Save updated user data to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('User data saved to localStorage');
        
        //Update the welcome message if it exists
        const welcomeMessage = document.querySelector('.welcome-text p');
        if (welcomeMessage) {
          welcomeMessage.textContent = `Welcome, ${firstName || userData.username || 'User'}!`;
        }
        
        //Update the header username
        updateHeaderUsername(userData.username);
        
        //Show success message
        alert('Settings saved successfully!' + (needsLogout ? ' Please log in again with your new credentials.' : ''));
        
        //If we updated password or email, log out
        if (needsLogout) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          window.location.href = '/HTML/login.html';
        } else {
          //Otherwise just redirect to index
          window.location.href = '/HTML/index.html';
        }
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('There was an error saving your settings. Please try again.');
      } finally {
        //Re-enable the button
        saveSettingsBtn.disabled = false;
        saveSettingsBtn.textContent = 'Save Settings';
      }
    });
  }
}

//Function to load existing profile picture
function loadExistingProfilePicture(profileImageElement) {
  if (!profileImageElement) return;
  
  //Try to get from localStorage first for quick display
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const profilePic = userData.profilePicture || (userData.profile && userData.profile.profilePicture);
  
  if (profilePic && typeof profilePic === 'string' && profilePic.startsWith('data:image/')) {
    profileImageElement.src = profilePic;
    console.log('Loaded existing profile picture from localStorage');
  } else {
    //If not in localStorage, try to fetch from server
    fetchProfilePictureFromServer(profileImageElement);
  }
}

//Function to fetch profile picture from server
async function fetchProfilePictureFromServer(profileImageElement) {
  if (!profileImageElement) return;
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;
  
  try {
    console.log('Fetching profile picture from server...');
    const response = await fetch('/api/profile', {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile data: ${response.status}`);
    }
    
    const profileData = await response.json();
    
    if (profileData.profilePicture && 
        typeof profileData.profilePicture === 'string' && 
        profileData.profilePicture.startsWith('data:image/')) {
      profileImageElement.src = profileData.profilePicture;
      console.log('Successfully loaded profile picture from server');
      
      //Update localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.profilePicture = profileData.profilePicture;
      if (!userData.profile) userData.profile = {};
      userData.profile.profilePicture = profileData.profilePicture;
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  } catch (error) {
    console.error('Error fetching profile picture from server:', error);
  }
}

//Function to refresh user data from server
async function refreshUserData() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;
  
  try {
    console.log('Refreshing user data from server...');
    
    //First get basic user data
    const userResponse = await fetch('/api/auth/user', {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!userResponse.ok) throw new Error(`Failed to refresh user data: ${userResponse.status}`);
    
    const userData = await userResponse.json();
    console.log('Basic user data refreshed from server');
    
    //Then get profile data which includes the profile picture
    const profileResponse = await fetch('/api/profile', {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!profileResponse.ok) throw new Error(`Failed to refresh profile data: ${profileResponse.status}`);
    
    const profileData = await profileResponse.json();
    console.log('Profile data refreshed from server');
    
    //Merge the data
    const mergedData = {
      ...userData,
      profile: profileData
    };
    
    //If profile has a profile picture, use it at the root level too for compatibility
    if (profileData.profilePicture) {
      mergedData.profilePicture = profileData.profilePicture;
    }
    
    //Save to localStorage
    localStorage.setItem('userData', JSON.stringify(mergedData));
    console.log('Combined user data saved to localStorage');
    
    return mergedData;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    throw error;
  }
}

function loadUserData() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    console.log('No token found, redirecting to login');
    window.location.href = '/HTML/login.html';
    return;
  }
  
  //First try to get data from localStorage for fast display
  const cachedUserData = localStorage.getItem('userData');
  if (cachedUserData) {
    try {
      const userData = JSON.parse(cachedUserData);
      populateUserData(userData);
    } catch (e) {
      console.error('Error parsing cached user data:', e);
    }
  }
  
  //Fetch fresh user data to get the latest email
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
    console.log('User data received from auth endpoint:', userData);
    
    //Important: Get the email from the auth endpoint (this is the registered email)
    const email = userData.email;
    
    //Update the email field immediately
    const emailInput = document.querySelector('.mid-email input[type="email"]');
    if (emailInput && email) {
      emailInput.value = email;
    }
    
    //Then fetch complete profile data
    return fetch('/api/profile', {
      headers: {
        'x-auth-token': token
      }
    });
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }
    return response.json();
  })
  .then(profileData => {
    console.log('Profile data received:', profileData);
    
    //Merge profile data with the email from auth endpoint
    const localData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    const mergedData = {
      ...localData,
      profile: {
        ...profileData,
        ...localData.profile //Keep any local changes
      }
    };
    
    //Make sure email from auth is preserved
    if (!mergedData.email && localData.email) {
      mergedData.email = localData.email;
    }
    
    //Save merged data to localStorage
    localStorage.setItem('userData', JSON.stringify(mergedData));
    
    //Populate the form fields with merged data
    populateUserData(mergedData);
  })
  .catch(err => {
    console.error('Failed to fetch user data:', err);
  });
}

function populateUserData(userData) {
  console.log('Populating user data in form fields:', userData);

  //Handle both direct userData and nested profile structure
  const profileData = userData.profile || {};
  
  //Populate username field
  const usernameInput = document.querySelector('.top-bottom-left input[placeholder="Username"]');
  if (usernameInput && (userData.username || profileData.username)) {
    usernameInput.value = userData.username || profileData.username || '';
    console.log('Set username:', usernameInput.value);
  }
  
  //Populate email field - prioritize the email from the auth endpoint (userData.email)
  //This is the actual registered email in the MongoDB database
  const emailInput = document.querySelector('.mid-email input[type="email"]');
  if (emailInput) {
    const email = userData.email || profileData.email || '';
    emailInput.value = email;
    console.log('Set email:', email);
  }
  
  //Populate name fields
    const firstNameInput = document.querySelector('.top-bottom-left input[placeholder="First Name"]');
    if (firstNameInput) {
    firstNameInput.value = profileData.firstName || '';
    console.log('Set firstName:', firstNameInput.value);
  }
  
    const lastNameInput = document.querySelector('.top-bottom-left input[placeholder="Last Name"]');
    if (lastNameInput) {
    lastNameInput.value = profileData.lastName || '';
    console.log('Set lastName:', lastNameInput.value);
  }
  
  //Update header username
  const username = userData.username || profileData.username;
  if (username) {
    updateHeaderUsername(username);
  }
  
  //Set profile picture if it exists
  const profilePicture = profileData.profilePicture || userData.profilePicture;
  if (profilePicture) {
    const profileImage = document.getElementById('photo');
    if (profileImage) {
      profileImage.src = profilePicture;
      console.log('Set profile image');
    }
  }
}

function updateHeaderUsername(username) {
  if (!username) return;
  
  const usernameElement = document.querySelector('header .right-section h3');
  if (usernameElement) {
    usernameElement.textContent = username;
  }
}

function setupFormHandlers() {
  //The individual edit buttons now only provide visual feedback
  //All actual saving is handled by the Save Settings button
  
  //Edit name button handler - now just shows feedback
  const editNameBtn = document.querySelector('.top-bottom button');
  if (editNameBtn) {
    editNameBtn.addEventListener('click', function() {
      const firstName = document.querySelector('.top-bottom-left input[placeholder="First Name"]').value;
      const lastName = document.querySelector('.top-bottom-left input[placeholder="Last Name"]').value;
      
      if (!firstName || !lastName) {
        alert('Please enter both first name and last name');
        return;
      }
      
      alert('Name looks good! Click "Save Settings" to apply all changes.');
    });
  }
  
  //Edit email button handler - now just shows feedback
  const editEmailBtn = document.getElementById('editemail');
  if (editEmailBtn) {
    editEmailBtn.addEventListener('click', function() {
      const currentEmail = document.querySelector('.mid-email input[type="email"]').value;
      const newEmail = document.getElementById('new-email').value;
      
      if (!currentEmail || !newEmail) {
        alert('Please enter both current and new email');
        return;
      }
      
      if (currentEmail === newEmail) {
        alert('New email must be different from current email');
        return;
      }
      
      alert('Email looks good! Click "Save Settings" to apply all changes.');
    });
  }
  
  //Edit password button handler - now just shows feedback
  const editPasswordBtn = document.getElementById('editpasswordbtn');
  if (editPasswordBtn) {
    editPasswordBtn.addEventListener('click', function() {
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if (!currentPassword) {
        alert('Please enter your current password');
        return;
      }
      
      if (!newPassword) {
        alert('Please enter a new password');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        alert('New password and confirm password must match!');
        return;
      }
      
      alert('Password looks good! Click "Save Settings" to apply all changes.');
    });
  }
}

async function uploadProfileImage(fileData) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  try {
    //Convert base64 to blob
    const response = await fetch(fileData.data);
    const blob = await response.blob();
    
  const formData = new FormData();
    formData.append('image', blob, 'profile-picture.' + fileData.type.split('/')[1]);
  formData.append('category', 'profile');
  
    const uploadResponse = await fetch('/api/images', {
    method: 'POST',
    headers: {
      'x-auth-token': token
    },
    body: formData
    });
    
    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }
    
    const data = await uploadResponse.json();
    console.log('Profile image uploaded:', data);
    
    return data.imageUrl;
  } catch (err) {
    console.error('Error uploading profile image:', err);
    throw new Error('Failed to upload profile image');
  }
}

async function updateUserProfile(profileData) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    const updatedProfile = await response.json();
    
    //Update localStorage with new profile data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.profile = updatedProfile;
    localStorage.setItem('userData', JSON.stringify(userData));

    //Update header profile picture if it exists
    if (updatedProfile.profilePicture) {
      const headerProfilePic = document.querySelector('header .right-section .pfp');
      if (headerProfilePic) {
        headerProfilePic.src = updatedProfile.profilePicture;
      }
    }
    
    return updatedProfile;
  } catch (err) {
    console.error('Error updating profile:', err);
    throw new Error('Failed to update profile');
  }
}

async function updateUserEmail(currentEmail, newEmail) {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in again to update your email');
      window.location.href = '/HTML/login.html';
      return;
    }

    console.log(`Attempting to update email from "${currentEmail}" to "${newEmail}"`);

    const response = await fetch('/api/profile/change-email', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({
        currentEmail,
        newEmail
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update email');
    }

    console.log('Email update successful, response:', data);

    //Update the profile data in localStorage with the complete profile information
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    //Update both locations to maintain consistency
    userData.email = newEmail; //Update at root level
    if (!userData.profile) userData.profile = {};
    userData.profile.email = newEmail; //Update in profile
    
    //If server returned a complete profile, use it
    if (data.profile) {
      userData.profile = data.profile;
    }
    
    localStorage.setItem('userData', JSON.stringify(userData));

    alert('Email updated successfully! Please log in again with your new email.');
    
    //Clear the email fields
    document.querySelector('.mid-email input[type="email"]').value = '';
    document.getElementById('new-email').value = '';

    //Log out the user
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/HTML/login.html';
  } catch (err) {
    console.error('Error updating email:', err);
    alert(err.message || 'Failed to update email. Please try again.');
  }
}

async function updateUserPassword(currentPassword, newPassword) {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in again to update your password');
      window.location.href = '/HTML/login.html';
      return;
    }

    const response = await fetch('/api/profile/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update password');
    }

    alert('Password updated successfully! Please log in again with your new password.');
    
    //Clear the password fields
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';

    //Log out the user
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/HTML/login.html';
  } catch (err) {
    console.error('Error updating password:', err);
    alert(err.message || 'Failed to update password. Please try again.');
  }
}