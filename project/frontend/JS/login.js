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

// Debug redirect function that tries multiple methods
function debugRedirect(url) {
  console.log(`Attempting to redirect to: ${url}`);
  try {
    // For registration, use the same method as login - meta refresh
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
    // Fallback to traditional redirect
    window.location.href = url;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility functionality
  const togglePasswordVisibility = (iconId, passwordId) => {
    const lockIcon = document.getElementById(iconId);
    const passwordInput = document.getElementById(passwordId);

    if (!lockIcon || !passwordInput) return; // Safety check

    lockIcon.addEventListener('click', () => {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });
  };

  // Apply to both login and register password fields
  togglePasswordVisibility('lockicon-login', 'password-login');
  togglePasswordVisibility('lockicon-register', 'password-register');

  // Handle Login Form Submission
  const loginForm = document.querySelector('.login-formbox form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent the default form submission
      
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
        
        if (response.ok) {
          // Store token in localStorage and sessionStorage for redundancy
          localStorage.setItem('token', data.token);
          sessionStorage.setItem('token', data.token);
          console.log('Login successful, token saved:', data.token);
          
          // Replace the entire document with a redirect page to the bypass-dashboard
          document.open();
          document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta http-equiv="refresh" content="0;url=/bypass-dashboard">
                <title>Redirecting to Dashboard</title>
                <script>
                  // Ensure token is available in the next page load
                  if (!localStorage.getItem('token')) {
                    localStorage.setItem('token', '${data.token}');
                  }
                </script>
              </head>
              <body style="background-color: #0e4166; color: white; font-family: 'Poppins', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center;">
                <div>
                  <h1>Login Successful!</h1>
                  <p>Redirecting to your dashboard...</p>
                  <p>If you are not redirected, <a href="/bypass-dashboard" style="color: white; text-decoration: underline;">click here</a>.</p>
                </div>
              </body>
            </html>
          `);
          document.close();
          return;
        }
         else {
          // Show error message
          console.error('Login failed:', data.msg);
          alert(data.msg || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Server error. Please try again later.');
      }
    });
  }
  
  // Handle Register Form Submission
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
          // Store token in localStorage and sessionStorage for redundancy
          localStorage.setItem('token', data.token);
          sessionStorage.setItem('token', data.token);
          
          // Use debug redirect (modified to use meta refresh) - point to bypass-dashboard
          document.open();
          document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta http-equiv="refresh" content="0;url=/bypass-dashboard">
                <title>Redirecting to Dashboard</title>
                <script>
                  // Ensure token is available in the next page load
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
          // Show specific error message
          alert(data.msg || 'Registration failed: ' + (data.msg || 'Unknown error'));
        }
      } catch (err) {
        console.error('Registration error details:', err);
        alert('Server error. Please try again later.');
      }
    });
  }
});