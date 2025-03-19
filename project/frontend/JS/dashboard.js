document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard.js loaded");

  // Setup UI first, then check authentication
  setupUIFunctionality();
  checkAuthentication();
  
  // Note: Chart setup is handled by chart.js
  
  function setupUIFunctionality() {
    console.log("Setting up UI functionality");
    
    // Debug UI elements
    logElementStatus();
    
    // Add navigation highlighting
    highlightCurrentPage();
    
    // Setup sidebar toggle button
    setupSidebarToggle();
    
    // Setup sidebar close button
    setupSidebarClose();
    
    // Setup submenu toggle
    setupSubmenuToggle();
    
    // Add logout functionality
    setupLogout();
    
    // Setup mood tracking
    setupMoodTracking();
  }
  
  function logElementStatus() {
    console.log("toggle-btn exists:", !!document.getElementById('toggle-btn'));
    console.log("close-btn exists:", !!document.getElementById('close-btn'));
    console.log("submenu-btn exists:", !!document.getElementById('submenu-btn'));
    console.log("nav exists:", !!document.querySelector('nav'));
    console.log("main exists:", !!document.querySelector('main'));
    console.log("sub-menu exists:", !!document.querySelector('.sub-menu'));
  }
  
  function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    console.log("Current page path:", currentPath);
    
    // Dashboard can have multiple paths
    const isDashboard = currentPath === '/HTML/index.html' || 
                        currentPath === '/bypass-dashboard' || 
                        currentPath === '/dashboard' || 
                        currentPath === '/direct-dashboard' ||
                        currentPath === '/';
    
    const menuItems = document.querySelectorAll('.menu-items');
    
    menuItems.forEach((item) => {
      try {
        const link = item.getAttribute('href');
        console.log("Menu item link:", link);
        
        // Check if this is a dashboard link
        if ((link === '/HTML/index.html' && isDashboard) || 
            (link === currentPath)) {
          item.classList.add('active');
          console.log("Active menu item set:", link);
        }
      } catch (err) {
        console.error("Error in menu item highlight:", err);
      }
    });
  }
  
  function setupSidebarToggle() {
    const toggleButton = document.getElementById('toggle-btn');
    const navbar = document.querySelector('nav');
    const dashboard = document.querySelector('main');
    
    if (toggleButton && navbar && dashboard) {
      console.log("Setting up toggle button...");
      
      // Remove any existing event listeners (in case general.js already added them)
      const newToggleBtn = toggleButton.cloneNode(true);
      toggleButton.parentNode.replaceChild(newToggleBtn, toggleButton);
      
      newToggleBtn.addEventListener("click", function(event) {
        console.log("Toggle button clicked");
        navbar.classList.toggle('show');
        dashboard.classList.toggle('after');
      });
    } else {
      console.warn("Sidebar toggle setup failed - missing elements");
    }
  }
  
  function setupSidebarClose() {
    const closeButton = document.getElementById('close-btn');
    const navbar = document.querySelector('nav');
    const dashboard = document.querySelector('main');
    
    if (closeButton && navbar && dashboard) {
      console.log("Setting up close button...");
      
      // Remove any existing event listeners
      const newCloseBtn = closeButton.cloneNode(true);
      closeButton.parentNode.replaceChild(newCloseBtn, closeButton);
      
      newCloseBtn.addEventListener("click", function(event) {
        console.log("Close button clicked");
        navbar.classList.remove('show');
        dashboard.classList.remove('after');
      });
    } else {
      console.warn("Sidebar close setup failed - missing elements");
    }
  }
  
  function setupSubmenuToggle() {
    const submenuButton = document.getElementById('submenu-btn');
    const submenu = document.querySelector('.sub-menu');
    
    if (submenuButton && submenu) {
      console.log("Setting up submenu button...");
      
      // Remove any existing event listeners
      const newSubmenuBtn = submenuButton.cloneNode(true);
      submenuButton.parentNode.replaceChild(newSubmenuBtn, submenuButton);
      
      newSubmenuBtn.addEventListener("click", function(event) {
        console.log("Submenu button clicked");
        submenu.classList.toggle('show');
        newSubmenuBtn.querySelector('i').classList.toggle('bx-chevron-up');
        newSubmenuBtn.querySelector('i').classList.toggle('bx-chevron-down');
      });
    } else {
      console.warn("Submenu toggle setup failed - missing elements");
    }
  }
  
  function setupLogout() {
    // Find logout link in submenu
    const logoutLink = document.querySelector('a[href="/HTML/login.html"]');
    
    if (logoutLink) {
      console.log("Setting up logout link...");
      
      // Remove any existing event listeners
      const newLogoutLink = logoutLink.cloneNode(true);
      logoutLink.parentNode.replaceChild(newLogoutLink, logoutLink);
      
      newLogoutLink.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Logout clicked");
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/HTML/login.html';
      });
    } else {
      console.warn("Logout link not found");
    }
  }
  
  function setupMoodTracking() {
    // Setup mood selection buttons if they exist
    const moodSections = document.querySelectorAll('.moodsection');
    
    if (moodSections.length > 0) {
      console.log("Setting up mood tracking...");
      
      moodSections.forEach(section => {
        section.addEventListener('click', function() {
          // Remove active class from all mood sections
          moodSections.forEach(s => s.classList.remove('active-mood'));
          
          // Add active class to the clicked mood section
          this.classList.add('active-mood');
          
          // You could save this to localStorage or send to server
          const selectedMood = this.querySelector('p').textContent;
          console.log("Selected mood:", selectedMood);
          
          // Save to localStorage for demo purposes
          localStorage.setItem('lastSelectedMood', selectedMood);
        });
      });
      
      // Load previously selected mood if any
      const lastMood = localStorage.getItem('lastSelectedMood');
      if (lastMood) {
        moodSections.forEach(section => {
          if (section.querySelector('p').textContent === lastMood) {
            section.classList.add('active-mood');
          }
        });
      }
    }
  }
  
  function checkAuthentication() {
    // Authentication verification
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      console.log("No token found");
      // For debugging, don't redirect
      // window.location.href = '/HTML/login.html';
      // return;
    } else {
      console.log("Token found: ", token.substring(0, 10) + "...");
      
      // Fetch the user data if needed
      fetchUserData(token);
    }
  }
  
  function fetchUserData(token) {
    console.log("Attempting to fetch user data...");
    
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
      
      // Store user data in localStorage for use across pages
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // No longer modifying the header based on username check
      // This preserves the header appearance across all pages
    })
    .catch(err => {
      console.error('Auth check failed:', err);
      // For debugging, don't clear token or redirect
    });
  }
});