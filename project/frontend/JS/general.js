document.addEventListener("DOMContentLoaded", () => {
  console.log("General.js loaded");

  //Determine which page we're on
  const currentPage = window.location.pathname;
  console.log("Current page:", currentPage);

  //Check if we just came from updating the profile picture
  const profileUpdated = sessionStorage.getItem('profilePictureUpdated');
  if (profileUpdated === 'true') {
    console.log('Profile picture was just updated, ensuring it loads correctly');
    //Clear the flag so we don't keep doing this
    sessionStorage.removeItem('profilePictureUpdated');
  }

  console.log("toggle-btn exists:", !!document.getElementById('toggle-btn'));
  console.log("close-btn exists:", !!document.getElementById('close-btn'));
  console.log("submenu-btn exists:", !!document.getElementById('submenu-btn'));
  console.log("nav exists:", !!document.querySelector('nav'));
  console.log("main exists:", !!document.querySelector('main'));
  console.log("sub-menu exists:", !!document.querySelector('.sub-menu'));

  //Only run navigation menu highlighting if menu items exist
  const menuItems = document.querySelectorAll('.menu-items');
  if (menuItems.length > 0) {
    menuItems.forEach((item) => {
      const link = item.getAttribute('href');
      if (link === currentPage) {
        item.classList.add('active');
      }
    });
  }

  //Only set up sidebar toggle if elements exist
  const toggleButton = document.getElementById('toggle-btn');
  const navbar = document.querySelector('nav');
  const dashboard = document.querySelector('main');
  
  if (toggleButton && navbar && dashboard) {
    toggleButton.addEventListener("click", () => {
      navbar.classList.toggle('show');
      dashboard.classList.toggle('after');
    });
  }

  //Only set up sidebar close if elements exist
  const closeButton = document.getElementById('close-btn');
  if (closeButton && navbar && dashboard) {
    closeButton.addEventListener("click", () => {
      navbar.classList.remove('show');
      dashboard.classList.remove('after');
    });
  }

  //Only set up submenu if elements exist
  const submenuButton = document.getElementById('submenu-btn');
  const submenu = document.querySelector('.sub-menu');
  if (submenuButton && submenu) {
    submenuButton.addEventListener("click", () => {
      submenu.classList.toggle('show');
      submenuButton.classList.toggle('downarrow-icon');
    });
  }
  
  //Check for authentication and update username display
  checkAuthAndUpdateUsername();

  //Set up header functionality
  setupHeader();
  
  //IMPORTANT: Load profile picture immediately if available in localStorage
  //This gives instant feedback while we wait for the server response
  loadProfilePictureFromLocalStorage();
  
  //Then fetch fresh data from server to ensure we have the latest
  updateHeaderWithUserData();
});

//Function to check authentication and update username
function checkAuthAndUpdateUsername() {
  //Get token from storage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    console.log("No token found");
    return;
  }
  
  console.log("Token found, fetching user data...");
  
  //Try to get cached user data first for instant display
  const cachedUserData = localStorage.getItem('userData');
  if (cachedUserData) {
    try {
      const userData = JSON.parse(cachedUserData);
      updateUsernameDisplay(userData.username || "User");
    } catch (e) {
      console.error('Error parsing cached user data:', e);
    }
  }
  
  //Then fetch fresh data from server
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
    
    //Save to localStorage for other pages
    localStorage.setItem('userData', JSON.stringify(userData));
    
    //Update the username display
    updateUsernameDisplay(userData.username || "User");
  })
  .catch(err => {
    console.error('Auth check failed:', err);
  });
}

//Function to update username in the UI
function updateUsernameDisplay(username) {
  //Find the username element in the header
  const usernameElements = document.querySelectorAll('h3');
  
  console.log(`Found ${usernameElements.length} possible username elements`);
  
  usernameElements.forEach(element => {
    //Check if this element is in the header section
    if (isElementInHeader(element)) {
      console.log(`Updating username display to: ${username}`);
      element.textContent = username;
    }
  });
}

//Helper function to determine if an element is in the header
function isElementInHeader(element) {
  //Check if the element is within a header element
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

function setupHeader() {
  const toggleBtn = document.getElementById('toggle-btn');
  const closeBtn = document.getElementById('close-btn');
  const submenuBtn = document.getElementById('submenu-btn');
  const nav = document.querySelector('nav');
  const submenu = document.querySelector('.sub-menu');
  
  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.add('active');
    });
  }
  
  if (closeBtn && nav) {
    closeBtn.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  }
  
  if (submenuBtn && submenu) {
    submenuBtn.addEventListener('click', () => {
      submenu.classList.toggle('active');
    });
  }

  //Close submenu when clicking outside
  document.addEventListener('click', (e) => {
    if (submenu && !submenu.contains(e.target) && !submenuBtn.contains(e.target)) {
      submenu.classList.remove('active');
    }
  });
}

function updateHeaderWithUserData() {
  console.log('Updating header with user data');
  
  //Ensure we're on a page with a header before proceeding
  if (!document.querySelector('header')) {
    console.log('No header found on this page');
    return;
  }
  
  //First try to update from localStorage for immediate display
  updateHeaderFromLocalStorage();
  
  //Then fetch fresh data from server to ensure we have the latest
  fetchAndUpdateUserData();
}

//Function to load profile picture directly from localStorage
function loadProfilePictureFromLocalStorage() {
  const profilePicElement = document.querySelector('header .right-section .pfp');
  if (!profilePicElement) {
    console.log('No profile picture element found in header');
    return;
  }
  
  //Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  //Check both locations for profile picture
  const profilePic = userData.profilePicture || (userData.profile && userData.profile.profilePicture);
  
  if (profilePic && typeof profilePic === 'string' && profilePic.startsWith('data:image/')) {
    console.log('Valid profile picture found in localStorage, loading immediately');
    //Set the profile picture
    profilePicElement.src = profilePic;
    //Mark the element with a data attribute to indicate it has been set
    profilePicElement.setAttribute('data-profile-loaded', 'true');
  } else {
    console.log('No valid profile picture in localStorage, using default for now');
    //Make sure we only set default if needed (check if already has custom image)
    if (!profilePicElement.getAttribute('data-profile-loaded')) {
      profilePicElement.src = '/images/profileicon.jpg';
    }
  }
}

//Function to save profile picture to localStorage
function saveProfilePictureToLocalStorage(profilePicture) {
  if (!profilePicture || typeof profilePicture !== 'string' || !profilePicture.startsWith('data:image/')) {
    console.error('Invalid profile picture data, not saving to localStorage');
    return;
  }
  
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    //Save in both formats for compatibility
    userData.profilePicture = profilePicture;
    if (!userData.profile) userData.profile = {};
    userData.profile.profilePicture = profilePicture;
    
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('Profile picture saved to localStorage');
  } catch (error) {
    console.error('Error saving profile picture to localStorage:', error);
  }
}

function updateHeaderFromLocalStorage() {
  //Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  //Handle both nested profile structure and flat structure
  const profile = userData.profile || userData || {};
  
  console.log('User profile data found in localStorage:', Object.keys(profile).join(', '));

  //Update username
  const usernameElement = document.querySelector('header .right-section h3');
  if (usernameElement) {
    const username = profile.username || 'User';
    usernameElement.textContent = username;
    console.log('Updated username to:', username);
  }

  //Update profile picture with error handling
  const profilePicElement = document.querySelector('header .right-section .pfp');
  if (profilePicElement) {
    console.log('Profile picture element found in header');
    
    //Check if profile picture exists and is valid
    if (profile.profilePicture && typeof profile.profilePicture === 'string' && 
        profile.profilePicture.startsWith('data:image/')) {
      console.log('Valid profile picture data found in localStorage');
      
      try {
        //Create a temporary Image to verify the image loads
        const tempImg = new Image();
        
        //Set crossOrigin to anonymous to avoid CORS issues with data URLs
        tempImg.crossOrigin = 'anonymous';
        
        //Set up error handler in case the image fails to load
        tempImg.onerror = () => {
          console.error('Failed to load profile picture from localStorage, using default');
          profilePicElement.src = '/images/profileicon.jpg'; //Default profile picture
        };
        
        //Set up load handler for successful image loading
        tempImg.onload = () => {
          console.log('Profile picture loaded successfully from localStorage');
          profilePicElement.src = profile.profilePicture;
        };
        
        //Try to load the image
        tempImg.src = profile.profilePicture;
      } catch (error) {
        console.error('Error loading profile picture from localStorage:', error);
        profilePicElement.src = '/images/profileicon.jpg';
      }
    } else {
      console.log('No valid profile picture in localStorage, will try to fetch from server');
      //Set default image for now
      profilePicElement.src = '/images/profileicon.jpg';
    }
  } else {
    console.log('No profile picture element found in header');
  }

  //Update welcome message if it exists
  const welcomeMessage = document.querySelector('.welcome-text p');
  if (welcomeMessage) {
    //Prioritize firstName from profile
    const displayName = profile.firstName || userData.firstName || profile.username || userData.username || 'User';
    console.log('Setting welcome message with name:', displayName);
    welcomeMessage.textContent = `Welcome, ${displayName}!`;
  }
}

async function fetchAndUpdateUserData() {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    console.log('No authentication token found, cannot fetch user data');
    return;
  }
  
  try {
    console.log('Fetching fresh user data from server');
    
    //First fetch user data from auth endpoint
    const userResponse = await fetch('/api/auth/user', {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user data: ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    console.log('User data fetched successfully');
    
    //Then fetch profile data which includes the profile picture
    const profileResponse = await fetch('/api/profile', {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!profileResponse.ok) {
      throw new Error(`Failed to fetch profile data: ${profileResponse.status}`);
    }
    
    const profileData = await profileResponse.json();
    console.log('Profile data fetched successfully');
    
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
    console.log('User data saved to localStorage');
    
    //Update the header with the fresh data
    updateHeaderWithFreshData(mergedData, profileData);
    
    //Set a flag to indicate we've successfully loaded data from the server
    sessionStorage.setItem('dataLoadedFromServer', 'true');
    
  } catch (error) {
    console.error('Error fetching user data from server:', error);
    //Continue with localStorage data if available
  }
}

function updateHeaderWithFreshData(userData, profileData) {
  //Update username
  const usernameElement = document.querySelector('header .right-section h3');
  if (usernameElement && userData.username) {
    usernameElement.textContent = userData.username;
    console.log('Updated username with fresh data:', userData.username);
  }
  
  //Update welcome message if it exists
  const welcomeMessage = document.querySelector('.welcome-text p');
  if (welcomeMessage) {
    //Prioritize firstName from profileData
    const displayName = profileData.firstName || userData.firstName || userData.username || 'User';
    console.log('Setting welcome message with name from server data:', displayName);
    welcomeMessage.textContent = `Welcome, ${displayName}!`;
  }
  
  console.log('Header update with fresh data complete');
}