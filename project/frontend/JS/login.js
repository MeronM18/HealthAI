function changeForm() {
  //create a function to change between login form and register form
  const loginFormBox = document.querySelector(".login-formbox");
  const registerFormBox = document.querySelector(".register-formbox");
  const registerButton = document.getElementById('register');
  const message = document.getElementById('message');

  loginFormBox.classList.toggle("hide");
  registerFormBox.classList.toggle("visible");

  if (registerButton.innerText === 'Register') {
    message.innerText = 'Already have an account?';
    registerButton.innerText = 'Login';
  } else {
    message.innerText = 'Don\'t have an account?';
    registerButton.innerText = 'Register';
  }
}

/******************************************************************************************************** */

console.log('Checking for navigation interceptors...');
const originalOpen = window.open;
const originalLocation = Object.getOwnPropertyDescriptor(window, 'location');

if (window.open !== originalOpen) {
  console.warn('window.open has been modified!');
}

if (Object.getOwnPropertyDescriptor(window, 'location') !== originalLocation) {
  console.warn('window.location has been modified!');
}

//Debug redirect function that tries multiple methods
function debugRedirect(url) {
  console.log(`Attempting to redirect to: ${url}`);
  try {
    //For registration, use the same method as login - meta refresh
    document.open();
    document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0;url=/bypass-dashboard">
          <title>Redirecting to Dashboard</title>
        </head>
        <body style="background-color: #0e4166; color: white; font-family: 'Poppins', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center;">
          <div>
            <h1>Registration Successful!</h1>
            <p>Redirecting to your dashboard...</p>
            <p>If you are not redirected, <a href="/bypass-dashboard" style="color: white; text-decoration: underline;">click here</a>.</p>
          </div>
        </body>
      </html>
    `);
    document.close();
  } catch (err) {
    console.error('Error during redirect:', err);
    //Fallback to traditional redirect
    window.location.href = url;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //Toggle password visibility functionality
  const togglePasswordVisibility = (iconId, passwordId) => {
    const lockIcon = document.getElementById(iconId);
    const passwordInput = document.getElementById(passwordId);

    if (!lockIcon || !passwordInput) return; //Safety check

    lockIcon.addEventListener('click', () => {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });
  };

  //Apply to both login and register password fields
  togglePasswordVisibility('lockicon-login', 'password-login');
  togglePasswordVisibility('lockicon-register', 'password-register');

  //Handle Login Form Submission
  const loginForm = document.querySelector('.login-formbox form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); //Prevent the default form submission
      
      const username = loginForm.querySelector('.usernamebox').value;
      const password = loginForm.querySelector('#password-login').value;
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }
        
        console.log('Login successful, received data:', data);
        
<<<<<<< HEAD
        //Save token
          localStorage.setItem('token', data.token);
        localStorage.setItem('healthai_token', data.token); //Save with app-specific key
        
        //Save full user data including ID and profile picture in BOTH formats for compatibility
        const userData = {
          //Root level data for backward compatibility
          _id: data.user.id, //Store ID as _id for easier access
=======
        // Save token
          localStorage.setItem('token', data.token);
        localStorage.setItem('healthai_token', data.token); // Save with app-specific key
        
        // Save full user data including ID and profile picture in BOTH formats for compatibility
        const userData = {
          // Root level data for backward compatibility
          _id: data.user.id, // Store ID as _id for easier access
>>>>>>> 0a94f13c0c78cfdafe7b5a984a8b46827db9275b
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          profilePicture: data.user.profilePicture,
          
<<<<<<< HEAD
          //Nested profile structure for new code
=======
          // Nested profile structure for new code
>>>>>>> 0a94f13c0c78cfdafe7b5a984a8b46827db9275b
          profile: {
            _id: data.user.id,
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            profilePicture: data.user.profilePicture
          }
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('Saved user data to localStorage:', Object.keys(userData).join(', '));
        
<<<<<<< HEAD
        //After saving, fetch full profile data
        await fetchFullProfileData(data.token, data.user.id);
        
        //Initialize user-specific data for new users
        initializeUserData(data.user.id);
        
        //Redirect to dashboard
=======
        // After saving, fetch full profile data
        await fetchFullProfileData(data.token, data.user.id);
        
        // Initialize user-specific data for new users
        initializeUserData(data.user.id);
        
        // Redirect to dashboard
>>>>>>> 0a94f13c0c78cfdafe7b5a984a8b46827db9275b
        window.location.href = '/HTML/index.html';
      } catch (err) {
        console.error('Login error:', err);
        alert(err.message || 'Login failed. Please try again.');
      }
    });
  }
  
  //Handle Register Form Submission
  const registerForm = document.querySelector('#register-form');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = registerForm.querySelector('.usernamebox-reg').value;
      const email = registerForm.querySelector('.emailbox').value;
      const password = registerForm.querySelector('#password-register').value;
      
      console.log('Attempting to register with:', { username, email, password: '****' });
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        console.log('Registration response:', data);
        
        if (response.ok) {
          //Store token in localStorage and sessionStorage for redundancy
          localStorage.setItem('token', data.token);
          sessionStorage.setItem('token', data.token);
          
          //Use debug redirect (modified to use meta refresh) - point to bypass-dashboard
          document.open();
          document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta http-equiv="refresh" content="0;url=/bypass-dashboard">
                <title>Redirecting to Dashboard</title>
                <script>
                  //Ensure token is available in the next page load
                  if (!localStorage.getItem('token')) {
                    localStorage.setItem('token', '${data.token}');
                  }
                </script>
              </head>
              <body style="background-color: #0e4166; color: white; font-family: 'Poppins', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center;">
                <div>
                  <h1>Registration Successful!</h1>
                  <p>Redirecting to your dashboard...</p>
                  <p>If you are not redirected, <a href="/bypass-dashboard" style="color: white; text-decoration: underline;">click here</a>.</p>
                </div>
              </body>
            </html>
          `);
          document.close();
        } else {
          //Show specific error message
          alert(data.msg || 'Registration failed: ' + (data.msg || 'Unknown error'));
        }
      } catch (err) {
        console.error('Registration error details:', err);
        alert('Server error. Please try again later.');
      }
    });
  }
});

<<<<<<< HEAD
//Function to fetch complete profile data after login
=======
// Function to fetch complete profile data after login
>>>>>>> 0a94f13c0c78cfdafe7b5a984a8b46827db9275b
async function fetchFullProfileData(token, userId) {
  try {
    const response = await fetch('/api/profile', {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!response.ok) {
<<<<<<< HEAD
      return; //Don't throw error, just proceed with what we have
=======
      return; // Don't throw error, just proceed with what we have
>>>>>>> 0a94f13c0c78cfdafe7b5a984a8b46827db9275b
    }
    
    const profileData = await response.json();
    
<<<<<<< HEAD
    //Update localStorage with complete profile data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    //Ensure we maintain both formats for compatibility
    //1. Update at root level (old format)
    Object.assign(userData, profileData);
    
    //2. Update in profile property (new format)
    if (!userData.profile) userData.profile = {};
    Object.assign(userData.profile, profileData);
    
    //Always ensure IDs are present
=======
    // Update localStorage with complete profile data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Ensure we maintain both formats for compatibility
    // 1. Update at root level (old format)
    Object.assign(userData, profileData);
    
    // 2. Update in profile property (new format)
    if (!userData.profile) userData.profile = {};
    Object.assign(userData.profile, profileData);
    
    // Always ensure IDs are present
>>>>>>> 0a94f13c0c78cfdafe7b5a984a8b46827db9275b
    if (!userData._id && userId) userData._id = userId;
    if (!userData.id && userId) userData.id = userId;
    if (!userData.profile._id && userId) userData.profile._id = userId;
    if (!userData.profile.id && userId) userData.profile.id = userId;
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log('Full profile data loaded and stored in both formats');
  } catch (err) {
    console.error('Error fetching full profile data:', err);
<<<<<<< HEAD
    //Continue with login process even if this fails
  }
}

//Function to initialize user-specific data for new users
=======
    // Continue with login process even if this fails
  }
}

// Function to initialize user-specific data for new users
>>>>>>> 0a94f13c0c78cfdafe7b5a984a8b46827db9275b
function initializeUserData(userId) {
  if (!userId) {
    console.error('Cannot initialize user data - no user ID provided');
    return;
  }
  console.log('Initializing user data for ID:', userId);
  
<<<<<<< HEAD
  //Check if streak data exists for this user
  const streakKey = `healthai_streak_${userId}`;
  const lastCheckInKey = `healthai_lastCheckIn_${userId}`;
  
  //Initialize streak data only if it doesn't exist
=======
  // Check if streak data exists for this user
  const streakKey = `healthai_streak_${userId}`;
  const lastCheckInKey = `healthai_lastCheckIn_${userId}`;
  
  // Initialize streak data only if it doesn't exist
>>>>>>> 0a94f13c0c78cfdafe7b5a984a8b46827db9275b
  if (localStorage.getItem(streakKey) === null) {
    console.log('Initializing streak data for new user');
    localStorage.setItem(streakKey, '0');
  } else {
    console.log('User already has streak data:', localStorage.getItem(streakKey));
  }
  
<<<<<<< HEAD
  //Initialize empty arrays for other data if they don't exist
=======
  // Initialize empty arrays for other data if they don't exist
>>>>>>> 0a94f13c0c78cfdafe7b5a984a8b46827db9275b
  const weightsKey = `healthai_weights_${userId}`;
  const caloriesKey = `healthai_calories_${userId}`;
  const exerciseKey = `healthai_exercise_${userId}`;
  
  if (localStorage.getItem(weightsKey) === null) {
    localStorage.setItem(weightsKey, JSON.stringify([]));
  }
  
  if (localStorage.getItem(caloriesKey) === null) {
    localStorage.setItem(caloriesKey, '0');
  }
  
  if (localStorage.getItem(exerciseKey) === null) {
    localStorage.setItem(exerciseKey, '0');
  }
  
  console.log('User data initialization complete');
}