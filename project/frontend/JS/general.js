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
  
  // Check for authentication and update username display
  checkAuthAndUpdateUsername();
});

// Function to check authentication and update username
function checkAuthAndUpdateUsername() {
  // Get token from storage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    console.log("No token found");
    return;
  }
  
  console.log("Token found, fetching user data...");
  
  // Try to get cached user data first for instant display
  const cachedUserData = localStorage.getItem('userData');
  if (cachedUserData) {
    try {
      const userData = JSON.parse(cachedUserData);
      updateUsernameDisplay(userData.username || "User");
    } catch (e) {
      console.error('Error parsing cached user data:', e);
    }
  }
  
  // Then fetch fresh data from server
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
    console.log("User data received:", userData);
    
    // Save to localStorage for other pages
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update the username display
    updateUsernameDisplay(userData.username || "User");
  })
  .catch(err => {
    console.error('Auth check failed:', err);
  });
}

// Function to update username in the UI
function updateUsernameDisplay(username) {
  // Find the username element in the header
  const usernameElements = document.querySelectorAll('h3');
  
  console.log(`Found ${usernameElements.length} possible username elements`);
  
  usernameElements.forEach(element => {
    // Check if this element is in the header section
    if (isElementInHeader(element)) {
      console.log(`Updating username display to: ${username}`);
      element.textContent = username;
    }
  });
}

// Helper function to determine if an element is in the header
function isElementInHeader(element) {
  // Check if the element is within a header element
  let parent = element.parentElement;
  while (parent) {
    if (parent.tagName === 'HEADER' || 
        parent.classList.contains('header') || 
        parent.classList.contains('right-section')) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}