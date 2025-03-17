document.addEventListener("DOMContentLoaded", () => {
  console.log("General.js loaded");
  
  // Determine which page we're on
  const currentPage = window.location.pathname;
  console.log("Current page:", currentPage);

  console.log("toggle-btn exists:", !!document.getElementById('toggle-btn'));
  console.log("close-btn exists:", !!document.getElementById('close-btn'));
  console.log("submenu-btn exists:", !!document.getElementById('submenu-btn'));
  console.log("nav exists:", !!document.querySelector('nav'));
  console.log("main exists:", !!document.querySelector('main'));
  console.log("sub-menu exists:", !!document.querySelector('.sub-menu'));
  
  // Only run navigation menu highlighting if menu items exist
  const menuItems = document.querySelectorAll('.menu-items');
  if (menuItems.length > 0) {
    menuItems.forEach((item) => {
      const link = item.getAttribute('href');
      if (link === currentPage) {
        item.classList.add('active');
      }
    });
  }

  // Only set up sidebar toggle if elements exist
  const toggleButton = document.getElementById('toggle-btn');
  const navbar = document.querySelector('nav');
  const dashboard = document.querySelector('main');
  
  if (toggleButton && navbar && dashboard) {
    toggleButton.addEventListener("click", () => {
      navbar.classList.toggle('show');
      dashboard.classList.toggle('after');
    });
  }

  // Only set up sidebar close if elements exist
  const closeButton = document.getElementById('close-btn');
  if (closeButton && navbar && dashboard) {
    closeButton.addEventListener("click", () => {
      navbar.classList.remove('show');
      dashboard.classList.remove('after');
    });
  }

  // Only set up submenu if elements exist
  const submenuButton = document.getElementById('submenu-btn');
  const submenu = document.querySelector('.sub-menu');
  if (submenuButton && submenu) {
    submenuButton.addEventListener("click", () => {
      submenu.classList.toggle('show');
      submenuButton.classList.toggle('downarrow-icon');
    });
  }
});