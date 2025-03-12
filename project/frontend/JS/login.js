function changeForm() { //create a function to change between login form and register form
  const loginFormBox = document.querySelector(".login-formbox"); //these 4 lines create variables that store the needed info from the HTMl
  const registerFormBox = document.querySelector(".register-formbox"); //this grabs the register form container
  const registerButton = document.getElementById('register'); //this grabs the register button
  const message = document.getElementById('message'); //this grabs the message button

  loginFormBox.classList.toggle("hide"); //from the forms, this will perform a class in the css that hides and shows the forms
  registerFormBox.classList.toggle("visible");

  if (registerButton.innerText === 'Register') { //checks if currently on login page or register page 
    message.innerText = 'Already have an account?';  //if on register formbox, the login nav will show on the left
    registerButton.innerText = 'Login';             
  } else { //vice versa
    message.innerText = 'Don\'t have an account?';  
    registerButton.innerText = 'Register';         
  }
}

/********************************************************* */

document.addEventListener("DOMContentLoaded", () => { //the DOMcontentloaded function is used read and modify contents and structure of a webpage
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
});  

/********************************************************* */

document.addEventListener("DOMContentLoaded", () => { //function to redirect to new page once login button is clicked
  const loginButton = document.getElementById('login-btn'); //grabs the login button from the login formbox
  
  const openPage = (event) => {
    event.preventDefault(); //prevents the page from refreshing
    
    try {
      window.location.href = "/HTML/index.html"; //opens the index.html page
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  
  if (loginButton) { //this checks if the login-btn id is actually true and exists in the DOM
    loginButton.addEventListener("click", openPage); //call the function openpage when clicked
  }
});

