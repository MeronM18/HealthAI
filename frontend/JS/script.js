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

let lockicon = document.getElementById('lockicon')
let password = document.getElementById('password')  

lockicon.onclick = function(){
  if(password.type == 'password'){
    password.type = 'text';
  }else{
    password.type = 'password';
  }
}

/********************************************************* */

const toggleButton = document.getElementById('toggle-btn');
toggleButton.addEventListener("click", openSideBar);

function openSideBar() {
  const navbar = document.querySelector('nav');
  navbar.classList.toggle('show');
}

/********************************************************* */
const closeButton = document.getElementById('close-btn');
closeButton.addEventListener("click", closeSideBar);

function closeSideBar(){
  const navbarshow = document.querySelector('nav');
  navbarshow.classList.remove('show');
}

/********************************************************* */
const submenuButton = document.getElementById('submenu-btn');
submenuButton.addEventListener("click", toggleSideMenu);

function toggleSideMenu() {
  const submenu = document.querySelector('.sub-menu');
  submenu.classList.toggle('show');

  submenuButton.classList.toggle('downarrow-icon')
}
