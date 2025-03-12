document.addEventListener("DOMContentLoaded", () => { //this functions checks what html page is currently loaded
  const currentPage = window.location.pathname; //grabs the name of the current window
  const menuItems = document.querySelectorAll('.menu-items'); //this selects all menu items from the navbar on the left side of page

  menuItems.forEach((item) => { //for all menuitems, this function is performed
    const link = item.getAttribute('href'); //grabs the link of what the menu items are referring to
    if (link === currentPage) { //checks if the link of each menu item is that of the current html page
      item.classList.add('active'); //if it is, this will call the css class to highlight the current page menu item
    }
  });
});

/********************************************************* */

const toggleButton = document.getElementById('toggle-btn'); //this grabs the button that opens the side menu and displays it
toggleButton.addEventListener("click", () => { //once clicked, the function is performed 
  const navbar = document.querySelector('nav'); //selects the nav container
  const dashboard = document.querySelector('main'); //also selects the main dashboard container

  navbar.classList.toggle('show'); //calls the show class to actually display the navbar
  dashboard.classList.toggle('after'); //this adjusts the layout of the main to fit the navbar in
});

/********************************************************* */

const closeButton = document.getElementById('close-btn'); //this is to close the navbar
closeButton.addEventListener("click", () => { //function once closed button is clicked 
  const navbarshow = document.querySelector('nav'); //grabs the nav container
  navbarshow.classList.remove('show'); //calls the shows class and removes any styles from it which removes the navbar and keeps it hidden

  const dashboardclose = document.querySelector('main'); //this grabs the main dashboard container again
  dashboardclose.classList.remove('after'); //removes any styles that were added and now back to current position
});

/********************************************************* */

const submenuButton = document.getElementById('submenu-btn'); //top right of header to open dropdown menu
submenuButton.addEventListener("click", () => { //function when the button is clicked 
  const submenu = document.querySelector('.sub-menu'); //grabs the class of the HTML elements 
  submenu.classList.toggle('show'); //calls the class to actually display the submenu

  submenuButton.classList.toggle('downarrow-icon'); //changes the downarrow icon into an arrow facing up
});