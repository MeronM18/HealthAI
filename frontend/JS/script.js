function changeForm() {
  var get = document.querySelector(".login-formbox");
  var get1 = document.querySelector(".register-formbox");
  const registerButton = document.getElementById('register');
  const message = document.getElementById('message');

  get.classList.toggle("hide");
  get1.classList.toggle("visible");

  if (registerButton.innerText === 'Register') {
    message.innerText = 'Already have an account?';  
    registerButton.innerText = 'Login';             
  } else {
    message.innerText = 'Don\'t have an account?';  
    registerButton.innerText = 'Register';         
}
}

/********************************************************* */

document.addEventListener("DOMContentLoaded", function () {
  let lockiconLogin = document.getElementById('lockicon-login');
  let passwordLogin = document.getElementById('password-login');
  
  lockiconLogin.onclick = function() {
    if(passwordLogin.type === 'password'){
      passwordLogin.type = 'text';
    } else {
      passwordLogin.type = 'password';
    }
  }
  
  let lockiconRegister = document.getElementById('lockicon-register');
  let passwordRegister = document.getElementById('password-register');  
  
  lockiconRegister.onclick = function() {
    if(passwordRegister.type === 'password'){
      passwordRegister.type = 'text';
    } else {
      passwordRegister.type = 'password';
    }
  }
});  

/********************************************************* */

document.addEventListener("DOMContentLoaded", function () {
  // Place all of your event listeners inside this to ensure the DOM is loaded
  const loginButton = document.getElementById('login-btn');
  
  if (loginButton) {
    loginButton.addEventListener("click", openPage);
  }
  
  function openPage(event) {
    event.preventDefault(); // Prevent the default action
    window.location.href = "/frontend/HTML/index.html";
  }
});

/********************************************************* */

document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname;
  const menuItems = document.querySelectorAll('.menu-items');

  menuItems.forEach(function(item){
    const link = item.getAttribute('href');
    if (link == currentPage) {
      item.classList.add('active');
    }
  })
})

/********************************************************* */

const toggleButton = document.getElementById('toggle-btn');
toggleButton.addEventListener("click", openSideBar);

function openSideBar() {
  const navbar = document.querySelector('nav');
  const dashboard = document.querySelector('main');

  navbar.classList.toggle('show');
  dashboard.classList.toggle('after');
}

/********************************************************* */

const closeButton = document.getElementById('close-btn');
closeButton.addEventListener("click", closeSideBar);

function closeSideBar(){
  const navbarshow = document.querySelector('nav');
  navbarshow.classList.remove('show');

  const dashboardclose = document.querySelector('main');
  dashboardclose.classList.remove('after');
}

/********************************************************* */

const submenuButton = document.getElementById('submenu-btn');
submenuButton.addEventListener("click", toggleSideMenu);

function toggleSideMenu() {
  const submenu = document.querySelector('.sub-menu');
  submenu.classList.toggle('show');

  submenuButton.classList.toggle('downarrow-icon')
}

