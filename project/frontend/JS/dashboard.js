//Update current date display
function updateCurrentDate() {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    
    const dateDisplay = document.getElementById('current-date');
    if (dateDisplay) {
        dateDisplay.textContent = formattedDate;
    }
}

function getLatestCalorieGoal() {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  //Try multiple storage keys in priority order
  let calorieGoal = null;
  
  //First try user-specific key - most reliable source
  if (userId) {
    const userSpecificKey = `healthai_calorieGoal_${userId}`;
    calorieGoal = localStorage.getItem(userSpecificKey);
    if (calorieGoal) {
    }
  }
  
  //If not found, try healthai_calorie_goal
  if (!calorieGoal) {
    calorieGoal = localStorage.getItem('healthai_calorie_goal');
    if (calorieGoal) {
    }
  }
  
  //If still not found, try CALORIE_GOAL
  if (!calorieGoal) {
    calorieGoal = localStorage.getItem('CALORIE_GOAL');
    if (calorieGoal) {
    }
  }
  
  //If still not found, check user data object
  if (!calorieGoal) {
    try {
      const healthai_user_data = JSON.parse(localStorage.getItem('healthai_user_data') || '{}');
      if (healthai_user_data.calorieGoal) {
        calorieGoal = healthai_user_data.calorieGoal.toString();
      }
    } catch (err) {
      console.error('Error retrieving calorie goal from user data object:', err);
    }
  }
  
  //Return the found value or a default of 2000
  return calorieGoal || "2000";
}

//Add this function to update all calorie goal displays on the page
function refreshCalorieGoalDisplay() {
}

//Modify DOMContentLoaded event to call our new function
document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard.js loaded");

  //Get user data and token
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const token = localStorage.getItem('healthai_token') || localStorage.getItem('token');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  console.log('User ID from localStorage:', userId);
  
  if (!token) {
    console.log('No token found, redirecting to login');
    window.location.href = '/HTML/login.html';
    return;
  }
  
  //Update welcome message with user's first name
  updateWelcomeMessage();
  
  //Initialize dashboard data
  updateDashboardData();
  
  //Schedule periodic updates
  setInterval(updateDashboardData, 5000);
  
  //Add storage event listener for real-time updates
  window.addEventListener('storage', function(e) {
    if (e.key && (
        e.key.includes('calorie') || 
        e.key.includes('CALORIE') || 
        e.key === 'healthai_refresh_dashboard' ||
        e.key.includes('userNutrition_') ||
        e.key.includes('weights_') ||  //Add listener for weight changes
        e.key.includes('goalWeight_')  //Add listener for goal weight changes
    )) {
        console.log('Storage event detected for:', e.key);
        
        //Update dashboard data for calorie-related changes
        updateDashboardData();
        
        //If it's a weight-related change, update the weight display
        if (e.key.includes('weights_') || e.key.includes('goalWeight_')) {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = userData._id || (userData.profile && userData.profile._id);
            
            if (userId) {
                const weightsKey = `healthai_weights_${userId}`;
                const weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
                updateWeightDisplay(weights);
            }
        }
    }
  });

  //Set up BroadcastChannel for cross-tab communication
  if (window.BroadcastChannel) {
    const bc = new BroadcastChannel('healthai_updates');
    bc.onmessage = function(event) {
      const message = event.data;
      
      //Handle calorie goal updates
      if (message.type === 'CALORIE_GOAL_UPDATE') {
        updateDashboardData();
      }
      
      //Handle weight updates
      if (message.type === 'WEIGHT_UPDATE') {
        if (userId) {
          const weightsKey = `healthai_weights_${userId}`;
          const weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
          updateWeightDisplay(weights);
        }
      }
    };
  }
  
  //Load initial user stats
  loadUserStats();
});

//Add storage event listener to refresh when localStorage changes
window.addEventListener('storage', function(e) {
  if (e.key && (
      e.key.includes('calorie') || 
      e.key.includes('CALORIE') || 
      e.key === 'healthai_refresh_dashboard' ||
      e.key.includes('userNutrition_') ||
      e.key.includes('weights_') ||  //Add listener for weight changes
      e.key.includes('goalWeight_')  //Add listener for goal weight changes
  )) {
    console.log('Storage event detected for:', e.key);
    
    //Update dashboard data for calorie-related changes
    updateDashboardData();
    
    //If it's a weight-related change, update the weight display
    if (e.key.includes('weights_') || e.key.includes('goalWeight_')) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData._id || (userData.profile && userData.profile._id);
        
        if (userId) {
            const weightsKey = `healthai_weights_${userId}`;
            const weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
            updateWeightDisplay(weights);
        }
    }
  }
});

//Add a periodic refresh to ensure goals stay current
setInterval(refreshCalorieGoalDisplay, 5000);

//Add this function to update all calorie goal displays on the page
function refreshCalorieGoalDisplay() {
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard.js loaded");

  //Get user data and token
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const token = localStorage.getItem('healthai_token') || localStorage.getItem('token');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  console.log('User ID from localStorage:', userId);
  
  if (!token) {
    console.log('No token found, redirecting to login');
    window.location.href = '/HTML/login.html';
    return;
  }
  
  //Update welcome message with user's first name
  updateWelcomeMessage();
  
  //Initialize user-specific streak data
  initializeUserStreak();
  
  //Set up check-in button
  const checkinBtn = document.getElementById('checkinbtn');
  if (checkinBtn) {
    checkinBtn.addEventListener('click', handleCheckIn);
    updateCheckInButtonState(); //Set initial button state based on localStorage
  }
  
  //Load and display recent stats
  loadUserStats();
  
  //Explicitly update the dashboard with any calorie goals
  updateDashboardData();
  
  //Setup UI functionality
  setupUIFunctionality();
  checkAuthentication();
  
  //Update the current date
  updateCurrentDate();
  
  //Replace the existing calorie goal check with our new function
  refreshCalorieGoalDisplay();
  
  //Schedule multiple refreshes to ensure the value is picked up
  //(This helps with timing issues if localStorage is updated after page load)
  setTimeout(refreshCalorieGoalDisplay, 1000);
  setTimeout(refreshCalorieGoalDisplay, 3000);
  
  //Initialize the macro chart if it exists
  initializeMacroChart();
  
});

//Function to initialize user streak data for new users
function initializeUserStreak() {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot initialize streak - no user ID found');
    return;
  }
  
  //Create a unique key for this user's streak data
  const streakKey = `healthai_streak_${userId}`;
  const lastCheckInKey = `healthai_lastCheckIn_${userId}`;
  
  //Check if streak data exists for this user
  if (localStorage.getItem(streakKey) === null) {
    console.log('Initializing streak data for new user:', userId);
    localStorage.setItem(streakKey, '0');
  }
  
  //Display the streak
  updateStreakDisplay();
}

//Handle check-in button click
function handleCheckIn() {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot check in - no user ID found');
    alert('Please log in again to use this feature');
    return;
  }
  
  //Create unique keys for this user
  const streakKey = `healthai_streak_${userId}`;
  const lastCheckInKey = `healthai_lastCheckIn_${userId}`;
  
  const today = new Date().toDateString();
  const lastCheckIn = localStorage.getItem(lastCheckInKey);
  
  if (lastCheckIn === today) {
    alert('You have already checked in today!');
    //Update the UI to reflect checked-in state
    updateCheckInButtonState();
    return;
  }
  
  //Open weight input overlay
  const weightOverlay = document.getElementById('weight-overlay');
  if (weightOverlay) {
    console.log('Opening weight overlay');
    weightOverlay.style.display = 'flex';
    weightOverlay.style.visibility = 'visible';
    weightOverlay.style.opacity = '1';
    
    //Focus on weight input
    const weightInput = document.getElementById('weight-input');
    if (weightInput) {
      weightInput.focus();
    }
    
    //Set up weight submission
    const submitWeightBtn = document.getElementById('submit-weight');
    const closeOverlayBtn = document.getElementById('close-weight-overlay');
    
    if (submitWeightBtn) {
      submitWeightBtn.onclick = function() {
        const weightInput = document.getElementById('weight-input');
        const weight = weightInput ? weightInput.value : null;
        
        if (!weight) {
          alert('Please enter your weight');
          return;
        }
        
        //Record the weight
        recordWeight(weight);
        
        //Update streak
        updateStreak(userId);
        
        //Hide overlay
        closeWeightOverlay(weightOverlay);
        
        //Update button state
        updateCheckInButtonState();
      };
    }
    
    if (closeOverlayBtn) {
      closeOverlayBtn.onclick = function() {
        closeWeightOverlay(weightOverlay);
      };
    }
    
    //Close overlay when clicking outside
    weightOverlay.addEventListener('click', function(e) {
      if (e.target === weightOverlay) {
        closeWeightOverlay(weightOverlay);
      }
    });
  } else {
    console.error('Weight overlay element not found');
  }
}

//Function to close the weight overlay with animation
function closeWeightOverlay(overlay) {
  console.log('Closing weight overlay');
  if (!overlay) {
    overlay = document.getElementById('weight-overlay');
    if (!overlay) return;
  }
  
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.visibility = 'hidden';
    overlay.style.display = 'none';
  }, 300);
}

//Record user weight
function recordWeight(weight) {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot record weight - no user ID found');
    return;
  }
  
  const weightsKey = `healthai_weights_${userId}`;
  const today = new Date().toISOString().split('T')[0]; //YYYY-MM-DD format
  
  //Get existing weights or initialize new array
  const weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
  
  //Add new weight entry
  weights.push({
    date: today,
    weight: parseFloat(weight)
  });
  
  //Save updated weights
  localStorage.setItem(weightsKey, JSON.stringify(weights));
  console.log(`Recorded weight ${weight} for user ${userId} on ${today}`);
  
  //Update UI with new weight if needed
  updateWeightDisplay(weights);
}

//Update the streak counter
function updateStreak(userId) {
  if (!userId) {
    console.error('Cannot update streak - no user ID provided');
    return;
  }
  
  const streakKey = `healthai_streak_${userId}`;
  const lastCheckInKey = `healthai_lastCheckIn_${userId}`;
  
  const today = new Date().toDateString();
  const lastCheckIn = localStorage.getItem(lastCheckInKey);
  
  //Get current streak
  let streak = parseInt(localStorage.getItem(streakKey) || '0');
  
  //Calculate if the streak should be reset or incremented
  if (lastCheckIn) {
    const lastDate = new Date(lastCheckIn);
    const currentDate = new Date(today);
    
    //Check if it's a consecutive day (exactly 1 day difference)
    const timeDiff = currentDate.getTime() - lastDate.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (dayDiff > 1) {
      //More than 1 day passed - reset streak
      console.log(`Streak reset: ${dayDiff} days since last check-in`);
      streak = 1;
    } else if (dayDiff === 1) {
      //Consecutive day - increment streak
      streak++;
    }
  } else {
    //First time checking in
    streak = 1;
  }
  
  //Save the updated streak and last check-in date
  localStorage.setItem(streakKey, streak.toString());
  localStorage.setItem(lastCheckInKey, today);
  
  //Update the streak display
  updateStreakDisplay();
  
  console.log(`Updated streak for user ${userId} to ${streak} days`);
  
  //Show confirmation to user
  alert(`Check-in successful! Current streak: ${streak} day${streak !== 1 ? 's' : ''}`);
}

//Update streak display in the UI
function updateStreakDisplay() {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot display streak - no user ID found');
    return;
  }
  
  const streakKey = `healthai_streak_${userId}`;
  const streakElement = document.querySelector('.progress-item:nth-child(2) .progress-value');
  
  if (streakElement) {
    const streak = localStorage.getItem(streakKey) || '0';
    console.log(`Displaying streak for user ${userId}: ${streak} days`);
    streakElement.textContent = `${streak} day${streak !== '1' ? 's' : ''}`;
  }
}

//Update check-in button state based on whether user has checked in today
function updateCheckInButtonState() {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot update check-in button - no user ID found');
    return;
  }
  
  const lastCheckInKey = `healthai_lastCheckIn_${userId}`;
  const today = new Date().toDateString();
  const lastCheckIn = localStorage.getItem(lastCheckInKey);
  
  console.log('Last check-in date:', lastCheckIn);
  console.log('Today:', today);
  console.log('Are they equal?', lastCheckIn === today);
  
  const checkinBtn = document.getElementById('checkinbtn');
  if (checkinBtn) {
    if (lastCheckIn === today) {
      //User already checked in today
      console.log('User already checked in today, updating button');
      checkinBtn.textContent = 'Checked In';
      checkinBtn.classList.add('checked');
      checkinBtn.disabled = true;
    } else {
      //User has not checked in today
      console.log('User has not checked in today, resetting button');
      checkinBtn.textContent = 'Check In';
      checkinBtn.classList.remove('checked');
      checkinBtn.disabled = false;
    }
  } else {
    console.error('Check-in button not found in the DOM');
  }
  
  //Also update streak display
  updateStreakDisplay();
}

//Load and display user stats (calories, weight, exercise)
function loadUserStats() {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot load stats - no user ID found');
    return;
  }
  
  //Load weights
  const weightsKey = `healthai_weights_${userId}`;
  const weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
  updateWeightDisplay(weights);
  
  //Load and display calorie goal from health information
  updateDashboardData();
}

//Update weight display in the UI
function updateWeightDisplay(weights) {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot update weight display - no user ID found');
    return;
  }
  
  //Get goal weight from localStorage - try multiple keys to ensure consistency
  const goalWeightKey = `healthai_goalWeight_${userId}`;
  let goalWeight = localStorage.getItem(goalWeightKey);
  
  //If not found in the user-specific key, try the global key
  if (!goalWeight) {
    goalWeight = localStorage.getItem('GOAL_WEIGHT');
    console.log('Using global GOAL_WEIGHT key, value:', goalWeight);
    
    //If found in global key but not in user-specific key, update the user-specific key
    if (goalWeight) {
      localStorage.setItem(goalWeightKey, goalWeight);
      console.log('Updated user-specific goal weight key with global value');
    }
  }
  
  //Find and update the current weight display element
  const weightElement = document.querySelector('.stat-item:nth-child(2) .stat-info p');
  if (weightElement && weights && weights.length > 0) {
    //Sort weights by date first
    weights.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    //Get the most recent weight entry
    const latestWeight = weights[0].weight;
    weightElement.textContent = `Current: ${latestWeight} lbs`;
  }
  
  //Find and update the goal weight span in the existing stat-tags
  const goalWeightSpan = document.querySelector('.stat-item:nth-child(2) .stat-tags span:first-child');
  if (goalWeightSpan) {
    if (goalWeight) {
      goalWeightSpan.textContent = `Goal: ${goalWeight} lbs`;
    } else {
      goalWeightSpan.textContent = 'Goal: -- lbs';
    }
  }
}

//Update dashboard data
function updateDashboardData() {
  console.log('Updating dashboard data...');
  
  const caloriesCount = document.getElementById('calories-count');
  const exerciseCalories = document.getElementById('exercise-calories');
  
  if (!caloriesCount || !exerciseCalories) {
    console.error('Required dashboard elements not found');
    return;
  }
  
  //Get user data
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('No user ID found');
    return;
  }
  
  //Get today's date for looking up today's nutrition data
  const today = new Date();
  const dateKey = formatDateKey(today);
  
  //Get nutrition data from meal tracking
  const userNutrition = JSON.parse(localStorage.getItem(`userNutrition_${userId}`) || '{}');
  const todayNutrition = userNutrition[dateKey] || { calories: 0, protein: 0, carbs: 0, fats: 0 };
  
  console.log('Today\'s nutrition data:', todayNutrition);
  
  //Get exercise calories
  const exerciseKey = `healthai_exercise_${userId}`;
  const exerciseCaloriesBurned = parseInt(localStorage.getItem(exerciseKey)) || 0;
  
  //Get the goal weight
  const goalWeightKey = `healthai_goalWeight_${userId}`;
  let goalWeight = localStorage.getItem(goalWeightKey);
  
  if (!goalWeight) {
    goalWeight = localStorage.getItem('GOAL_WEIGHT');
    console.log('Using global GOAL_WEIGHT key, value:', goalWeight);
  }
  
  //Get calorie goal
  const calorieGoal = getLatestCalorieGoal();
  console.log(`Using calorie goal: ${calorieGoal} kcal for dashboard update`);
  
  //Update calorie counts
  const totalCalories = parseInt(todayNutrition.calories) || 0;
  caloriesCount.textContent = totalCalories;
  
  //Update exercise calories
  exerciseCalories.textContent = exerciseCaloriesBurned;
  
  //Update protein, carbs, and fats
  updateNutrientDisplays(todayNutrition);
  
  //Update recent progress calories if element exists
  const recentProgressCalories = document.getElementById('recent-progress-calories');
  if (recentProgressCalories) {
    recentProgressCalories.textContent = totalCalories;
  }
  
  console.log('Dashboard update completed with calories:', totalCalories);
}

//Format date for localStorage key
function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

//Update the nutrient displays (protein, carbs, fats)
function updateNutrientDisplays(nutrition) {
  //Update only if we have nutrition data
  if (!nutrition) return;
  
  //Find the nutrient display elements (they may not exist in all dashboard versions)
  const proteinDisplay = document.getElementById('protein-display');
  const carbsDisplay = document.getElementById('carbs-display');
  const fatsDisplay = document.getElementById('fats-display');
  
  //Update protein
  if (proteinDisplay) {
    proteinDisplay.textContent = `${nutrition.protein || 0}g`;
  }
  
  //Update carbs
  if (carbsDisplay) {
    carbsDisplay.textContent = `${nutrition.carbs || 0}g`;
  }
  
  //Update fats
  if (fatsDisplay) {
    fatsDisplay.textContent = `${nutrition.fats || 0}g`;
  }
  
  //Update macro chart if it exists
  updateMacroChart(nutrition);
}

//Update the macro chart if it exists
function updateMacroChart(nutrition) {
  const macroChartElement = document.getElementById('dashboard-macro-chart');
  if (!macroChartElement) return;
  
  const protein = nutrition.protein || 0;
  const carbs = nutrition.carbs || 0;
  const fats = nutrition.fats || 0;
  
  if (window.dashboardMacroChart) {
    //Update existing chart
    window.dashboardMacroChart.data.datasets[0].data = [protein, carbs, fats];
    
    const totalGrams = protein + carbs + fats;
    if (totalGrams > 0) {
      const proteinPercentage = (protein / totalGrams * 100).toFixed(1);
      const carbsPercentage = (carbs / totalGrams * 100).toFixed(1);
      const fatsPercentage = (fats / totalGrams * 100).toFixed(1);
      
      window.dashboardMacroChart.data.datasets[1].data = [proteinPercentage, carbsPercentage, fatsPercentage];
    } else {
      window.dashboardMacroChart.data.datasets[1].data = [0, 0, 0];
    }
    
    window.dashboardMacroChart.update();
  } else if (typeof Chart !== 'undefined' && macroChartElement) {
    //Create new chart
    window.dashboardMacroChart = new Chart(macroChartElement.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Protein', 'Carbs', 'Fats'],
        datasets: [
          {
            label: 'Grams',
            data: [protein, carbs, fats],
            backgroundColor: [
              '#4CAF50',
              '#2196F3',
              '#FFC107'
            ],
            borderColor: [
              '#2E7D32',
              '#0D47A1',
              '#FF8F00'
            ],
            borderWidth: 1
          },
          {
            label: 'Percentage',
            data: [
              totalGrams > 0 ? (protein / totalGrams * 100).toFixed(1) : 0,
              totalGrams > 0 ? (carbs / totalGrams * 100).toFixed(1) : 0,
              totalGrams > 0 ? (fats / totalGrams * 100).toFixed(1) : 0
            ],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
            grid: {
              display: false
            },
            ticks: {
              color: '#fff'
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#fff'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw;
                if (context.datasetIndex === 0) {
                  return `${label}: ${value}g`;
                } else {
                  return `${value}%`;
                }
              }
            }
          }
        }
      }
    });
  }
}

//Function to update the welcome message with the user's first name
function updateWelcomeMessage() {
  const welcomeMessage = document.querySelector('.welcome-text p');
  if (!welcomeMessage) return;
  
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const profile = userData.profile || userData || {};
  
  //Prioritize first name from profile
  const firstName = profile.firstName || userData.firstName;
  const username = profile.username || userData.username;
  
  if (firstName) {
    console.log('Setting welcome message with first name:', firstName);
    welcomeMessage.textContent = `Welcome, ${firstName}!`;
  } else if (username) {
    console.log('First name not found, using username:', username);
    welcomeMessage.textContent = `Welcome, ${username}!`;
  } else {
    console.log('No user data found, using default welcome message');
    welcomeMessage.textContent = 'Welcome to HealthAI!';
  }
}
  
  function setupUIFunctionality() {
    console.log("Setting up UI functionality");
    
    //Debug UI elements
    logElementStatus();
    
    //Add navigation highlighting
    highlightCurrentPage();
    
    //Setup sidebar toggle button
    setupSidebarToggle();
    
    //Setup sidebar close button
    setupSidebarClose();
    
    //Setup submenu toggle
    setupSubmenuToggle();
    
    //Add logout functionality
    setupLogout();
    
    //Setup mood tracking
    setupMoodTracking();

  //Chat with Healix redirection
  const startChatButton = document.querySelector('.connect-card .see-all');
  if (startChatButton) {
    console.log('Start Chat button found:', !!startChatButton);
    startChatButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Start Chat button clicked');
      window.location.href = 'ai.html';
    });
  } else {
    console.error('Start Chat button not found in the DOM');
  }

  //Fasting Timer
  const fastingTimeInput = document.getElementById('fasting-time');
  const startFastingBtn = document.getElementById('start-fasting');
  const endFastingBtn = document.getElementById('end-fasting');
  const timerDisplay = document.getElementById('timer-display');
  let fastingInterval;
  let fastingStartTime;

  if (startFastingBtn) {
    startFastingBtn.addEventListener('click', function() {
      if (!fastingTimeInput || !fastingTimeInput.value) {
        return;
      }
      
      const [hours, minutes] = fastingTimeInput.value.split(':');
      fastingStartTime = new Date();
      fastingStartTime.setHours(fastingStartTime.getHours() + parseInt(hours));
      fastingStartTime.setMinutes(fastingStartTime.getMinutes() + parseInt(minutes));
      
      fastingInterval = setInterval(updateFastingTimer, 1000);
      startFastingBtn.disabled = true;
      endFastingBtn.disabled = false;
    });
  }

  if (endFastingBtn) {
    endFastingBtn.addEventListener('click', function() {
      clearInterval(fastingInterval);
      if (timerDisplay) timerDisplay.textContent = '00:00';
      if (startFastingBtn) startFastingBtn.disabled = false;
      endFastingBtn.disabled = true;
    });
  }

  function updateFastingTimer() {
    if (!timerDisplay || !fastingStartTime) return;
    
    const now = new Date();
    const timeLeft = fastingStartTime - now;
    
    if (timeLeft <= 0) {
      clearInterval(fastingInterval);
      timerDisplay.textContent = '00:00';
      if (startFastingBtn) startFastingBtn.disabled = false;
      if (endFastingBtn) endFastingBtn.disabled = true;
      return;
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  //Update calories and exercise from localStorage
  updateDashboardData();

  //Listen for storage events to update dashboard when localStorage changes
  window.addEventListener('storage', function(e) {
    console.log('Storage event detected:', e.key, e.newValue);
    
    //Check if the changed key is related to user data we care about
    if (e.key && (
        e.key.includes('calories') || 
        e.key.includes('exercise') || 
        e.key.includes('calorieGoal') ||
        e.key === 'healthai_refresh_dashboard'  //Special trigger from health page
    )) {
      console.log('Updating dashboard due to localStorage change:', e.key);
      updateDashboardData();
    }
  });
  
  //Also refresh dashboard data every 5 seconds to ensure it stays updated
  setInterval(updateDashboardData, 5000);
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
    
    //Dashboard can have multiple paths
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
        
        //Check if this is a dashboard link
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
      
      //Remove any existing event listeners (in case general.js already added them)
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
      
      //Remove any existing event listeners
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
      
      //Remove any existing event listeners
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
    //Find logout link in submenu
    const logoutLink = document.querySelector('a[href="/HTML/login.html"]');
    
    if (logoutLink) {
      console.log("Setting up logout link...");
      
      //Remove any existing event listeners
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
    //Setup mood selection buttons if they exist
    const moodSections = document.querySelectorAll('.moodsection');
    
    if (moodSections.length > 0) {
      console.log("Setting up mood tracking...");
      
      moodSections.forEach(section => {
        section.addEventListener('click', function() {
          //Remove active class from all mood sections
          moodSections.forEach(s => s.classList.remove('active-mood'));
          
          //Add active class to the clicked mood section
          this.classList.add('active-mood');
          
          //You could save this to localStorage or send to server
          const selectedMood = this.querySelector('p').textContent;
          console.log("Selected mood:", selectedMood);
          
          //Save to localStorage for demo purposes
          localStorage.setItem('lastSelectedMood', selectedMood);
        });
      });
      
      //Load previously selected mood if any
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
    //Authentication verification
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      console.log("No token found");
      //For debugging, don't redirect
      //window.location.href = '/HTML/login.html';
      //return;
    } else {
      console.log("Token found: ", token.substring(0, 10) + "...");
      
      //Fetch the user data if needed
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
      
      //Store user data in localStorage for use across pages
      localStorage.setItem('userData', JSON.stringify(userData));
      
    //Update the welcome message again in case user data changed
    updateWelcomeMessage();
    })
    .catch(err => {
      console.error('Auth check failed:', err);
      //For debugging, don't clear token or redirect
    });
  }

//Add this event listener to refresh when localStorage changes
window.addEventListener('storage', function(e) {
  //If any calorie goal keys change, refresh the display
  if (e.key && (
      e.key.includes('calorie') || 
      e.key.includes('CALORIE') || 
      e.key === 'healthai_refresh_dashboard'
  )) {
    console.log('Storage event detected for calorie goal:', e.key, e.newValue);
    refreshCalorieGoalDisplay();
  }
});

//Add this periodic check to ensure the goal always stays current
setInterval(refreshCalorieGoalDisplay, 5000);

//Force dashboard to use health calorie goal by directly setting stat tags
document.addEventListener("DOMContentLoaded", function() {
  //Give the page time to fully load
  setTimeout(function() {
    //Get user ID
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || (userData.profile && userData.profile._id);
    
    //First try to get the user-specific calorie goal (most reliable)
    let calorieGoal = null;
    if (userId) {
      const userCalorieGoalKey = `healthai_calorieGoal_${userId}`;
      calorieGoal = localStorage.getItem(userCalorieGoalKey);
      if (calorieGoal) {
      }
    }
    
    //If not found, try other storage keys
    if (!calorieGoal) {
      calorieGoal = localStorage.getItem('healthai_calorie_goal');
      if (calorieGoal) {
      }
    }
    
    if (!calorieGoal) {
      calorieGoal = localStorage.getItem('CALORIE_GOAL');
      if (calorieGoal) {
      }
    }
    
    //If still no calorie goal found, use a reasonable default
    if (!calorieGoal) {
      calorieGoal = "2000";
    }
    
    //Save this value to localStorage to ensure consistency
    localStorage.setItem('healthai_calorie_goal', calorieGoal);
    localStorage.setItem('CALORIE_GOAL', calorieGoal);
    if (userId) {
      localStorage.setItem(`healthai_calorieGoal_${userId}`, calorieGoal);
    }
  }, 500);
  
  //Run again after a longer delay to catch any late updates
  setTimeout(function() {
    refreshCalorieGoalDisplay();
  }, 1500);
});

//Listen for emergency calorie updates from health.js
window.addEventListener('storage', function(e) {
  if (e.key === 'EMERGENCY_CALORIE_UPDATE') {
    const calorieGoal = e.newValue;
    if (calorieGoal) {
      //Save to all localStorage keys
      localStorage.setItem('healthai_calorie_goal', calorieGoal);
      localStorage.setItem('CALORIE_GOAL', calorieGoal);
      
      //Get user ID
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData._id || (userData.profile && userData.profile._id);
      if (userId) {
        localStorage.setItem(`healthai_calorieGoal_${userId}`, calorieGoal);
      }
    }
  }
});

//Listen for BroadcastChannel messages
if (window.BroadcastChannel) {
  const bc = new BroadcastChannel('healthai_updates');
  bc.onmessage = function(event) {
    if (event.data && event.data.type === 'CALORIE_GOAL_UPDATE') {
      console.log(`BROADCAST: Received calorie update: ${event.data.calorieGoal}`);
      const calorieGoal = event.data.calorieGoal;
      if (calorieGoal) {
        //Save to all localStorage keys
        localStorage.setItem('healthai_calorie_goal', calorieGoal.toString());
        localStorage.setItem('CALORIE_GOAL', calorieGoal.toString());
        
        //Get user ID
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData._id || (userData.profile && userData.profile._id);
        if (userId) {
          localStorage.setItem(`healthai_calorieGoal_${userId}`, calorieGoal.toString());
        }
        
        //Update all calorie goal spans
        refreshCalorieGoalDisplay();
      }
    }
  };
}

//DIRECT FORCE OVERRIDE 
//This function will be called on page load to immediately set the correct value
function forceCorrectCalorieGoal() {
  //Get user ID for user-specific data
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  //Get health data to check the weekly goal
  let weeklyGoal = "";
  try {
    const healthData = JSON.parse(localStorage.getItem(`healthai_healthData_${userId}`) || '{}');
    weeklyGoal = healthData.weeklyGoal || "";
  } catch(e) {
    console.error("Error checking health data:", e);
  }
  
  //Determine correct calorie goal based on weekly goal
  let calorieGoal = "";
  
  //Use standard localStorage approach - no hardcoded values
  //Get from user-specific localStorage
  if (userId) {
    calorieGoal = localStorage.getItem(`healthai_calorieGoal_${userId}`);
    if (calorieGoal) {
    }
  }
  
  //Try other storage keys if needed
  if (!calorieGoal) {
    calorieGoal = localStorage.getItem('healthai_calorie_goal') || 
                  localStorage.getItem('CALORIE_GOAL') || 
                  "2000";
  }
  
  //Save this value to localStorage to ensure consistency
  localStorage.setItem('healthai_calorie_goal', calorieGoal);
  localStorage.setItem('CALORIE_GOAL', calorieGoal);
  if (userId) {
    localStorage.setItem(`healthai_calorieGoal_${userId}`, calorieGoal);
  }
}

//Run this function immediately when the script loads
document.addEventListener("DOMContentLoaded", function() {
  //Call immediately
  forceCorrectCalorieGoal();
  
  //And run again after a short delay to make sure it's applied
  setTimeout(forceCorrectCalorieGoal, 500);
  setTimeout(forceCorrectCalorieGoal, 1000);
  setTimeout(forceCorrectCalorieGoal, 2000);
});

//Initialize macro chart if it exists
function initializeMacroChart() {
  const macroChartElement = document.getElementById('dashboard-macro-chart');
  if (!macroChartElement || typeof Chart === 'undefined') return;
  
  //Get user data
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('No user ID found');
    return;
  }
  
  //Get today's nutrition data
  const today = new Date();
  const dateKey = formatDateKey(today);
  const userNutrition = JSON.parse(localStorage.getItem(`userNutrition_${userId}`) || '{}');
  const todayNutrition = userNutrition[dateKey] || { protein: 0, carbs: 0, fats: 0 };
  
  updateMacroChart(todayNutrition);
}

//Setup event listeners for storage changes
function setupStorageListeners() {
  window.addEventListener('storage', function(e) {
    console.log('Storage event detected:', e.key, e.newValue);
    
    //Check if the changed key is related to user data we care about
    if (e.key && (
        e.key.includes('calories') || 
        e.key.includes('exercise') || 
        e.key.includes('calorieGoal') ||
        e.key.includes('userNutrition') ||
        e.key.includes('userMeals') ||
        e.key === 'healthai_refresh_dashboard'  //Special trigger from health page
    )) {
      console.log('Updating dashboard due to localStorage change:', e.key);
      updateDashboardData();
    }
  });
}

//Add a function to check for nutrition data changes periodically
function checkForNutritionUpdates() {
  //Get user data
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) return;
  
  //Get today's date for looking up today's nutrition data
  const today = new Date();
  const dateKey = formatDateKey(today);
  
  //Get nutrition data from meal tracking
  const userNutrition = JSON.parse(localStorage.getItem(`userNutrition_${userId}`) || '{}');
  const todayNutrition = userNutrition[dateKey] || { calories: 0, protein: 0, carbs: 0, fats: 0 };
  
  //Get the calories count element
  const caloriesCount = document.getElementById('calories-count');
  
  //If the calories count doesn't match the nutrition data, update it
  if (caloriesCount && parseInt(caloriesCount.textContent) !== todayNutrition.calories) {
    console.log('Updating calories count from', caloriesCount.textContent, 'to', todayNutrition.calories);
    caloriesCount.textContent = todayNutrition.calories || 0;
    
    //Also update the remaining calories
    const calorieGoal = getLatestCalorieGoal();
    const remainingSpan = document.getElementById('remaining-calories');
    if (remainingSpan) {
      const remaining = Math.max(0, parseInt(calorieGoal) - parseInt(todayNutrition.calories || 0));
      remainingSpan.textContent = `Remaining: ${remaining} kcal`;
    }
  }
}

//Add a periodic check for nutrition updates
setInterval(checkForNutritionUpdates, 2000);

//Listen for storage events to refresh the dashboard when localStorage changes
window.addEventListener('storage', (event) => {
  if (event.key === 'healthai_refresh_dashboard') {
    updateDashboardData();
  }
});

//Listen for health data updates
document.addEventListener('healthDataUpdated', function(event) {
  const { currentWeight, goalWeight, calorieGoal } = event.detail;
  
  //Get user ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (userId) {
    //Update the user-specific goal weight key
    localStorage.setItem(`healthai_goalWeight_${userId}`, goalWeight.toString());
  }
  
  //Update weight displays
  const currentWeightDisplay = document.getElementById('current-weight');
  const goalWeightDisplay = document.getElementById('goal-weight');
  if (currentWeightDisplay) {
    currentWeightDisplay.textContent = `${currentWeight} lbs`;
  }
  if (goalWeightDisplay) {
    goalWeightDisplay.textContent = `${goalWeight} lbs`;
  }
  
  //Also update the goal weight in the stat-tags
  const goalWeightSpan = document.querySelector('.stat-item:nth-child(2) .stat-tags span:first-child');
  if (goalWeightSpan) {
    goalWeightSpan.textContent = `Goal: ${goalWeight} lbs`;
  }
  
  //Update calorie displays
  const calorieGoalSpan = document.getElementById('calorie-goal');
  const exerciseGoalSpan = document.getElementById('exercise-goal');
  const remainingSpan = document.getElementById('remaining-calories');
  
  if (calorieGoalSpan) {
    calorieGoalSpan.textContent = `Goal: ${calorieGoal} kcal`;
  }
  if (exerciseGoalSpan) {
    exerciseGoalSpan.textContent = `Goal: ${calorieGoal} kcal`;
  }
  if (remainingSpan) {
    const caloriesCount = document.getElementById('calories-count');
    if (caloriesCount) {
      const calories = parseInt(caloriesCount.textContent) || 0;
      const remaining = Math.max(0, parseInt(calorieGoal) - calories);
      remainingSpan.textContent = `Remaining: ${remaining} kcal`;
    }
  }
  
  //Update weight chart if it exists
  if (window.weightChart) {
    const weightsKey = `healthai_weights_${userId}`;
    const weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
    updateWeightChart(weights);
  }
});

//Listen for cross-tab updates
if (window.BroadcastChannel) {
  const bc = new BroadcastChannel('healthai_updates');
  bc.onmessage = function(event) {
    if (event.data.type === 'HEALTH_UPDATE') {
      const updateEvent = new CustomEvent('healthDataUpdated', {
        detail: event.data.data
      });
      document.dispatchEvent(updateEvent);
    }
  };
}

//Function to force a refresh of the goal weight display
function forceRefreshGoalWeight() {
  //Get user ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot refresh goal weight - no user ID found');
    return;
  }
  
  //Try to get goal weight from multiple sources
  const goalWeightKey = `healthai_goalWeight_${userId}`;
  let goalWeight = localStorage.getItem(goalWeightKey);
  
  if (!goalWeight) {
    goalWeight = localStorage.getItem('GOAL_WEIGHT');
    console.log('Using global GOAL_WEIGHT key for refresh, value:', goalWeight);
    
    //If found in global key but not in user-specific key, update the user-specific key
    if (goalWeight) {
      localStorage.setItem(goalWeightKey, goalWeight);
      console.log('Updated user-specific goal weight key with global value during refresh');
    }
  }
  
  //Update the goal weight display in the stat-tags
  const goalWeightSpan = document.querySelector('.stat-item:nth-child(2) .stat-tags span:first-child');
  if (goalWeightSpan && goalWeight) {
    goalWeightSpan.textContent = `Goal: ${goalWeight} lbs`;
    console.log('Updated goal weight display to:', goalWeight);
  }
}

//Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  //... existing code ...
  
  //Force a refresh of the goal weight display
  forceRefreshGoalWeight();
  
  //... existing code ...
});