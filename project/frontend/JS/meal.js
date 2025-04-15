document.addEventListener('DOMContentLoaded', function() {
  const yesterdayBtn = document.getElementById('leftdatebtn');
  const tomorrowBtn = document.getElementById('rightdatebtn');
  const dateSpan = document.getElementById('datespan');

  const breakfastAddBtn = document.getElementById('breakfastaddbtn');
  const snacksAddBtn = document.getElementById('snacksaddbtn');
  const lunchaddbtn = document.getElementById('lunchaddbtn');
  const drinksaddbtn = document.getElementById('drinksaddbtn');
  const dinneraddbtn = document.getElementById('dinneraddbtn');
  const searchMealsDiv = document.getElementById('searchfood');
  const addFoodBtn = document.getElementById('addFoodBtn');
  const closeFoodBtn = document.getElementById('closeFoodBtn');
  const foodSearchInput = document.getElementById('food-input-box');
  const searchBtn = document.getElementById('searchbtn');
  const mealSuggestionsList = document.getElementById('mealsuggestions');
  
  const breakfastLogContainer = document.querySelector('.breakfastlog-container');
  const snacksLogContainer = document.querySelector('.snackslog-container');
  const lunchLogContainer = document.querySelector('.lunchlog-container');
  const drinksLogContainer = document.querySelector('.drinkslog-container');
  const dinnerLogContainer = document.querySelector('.dinnerlog-container');

  const calorieCount = document.getElementById('caloriecountmealpage');
  const foodNameElement = document.querySelector('.foodname');
  const caloriesElement = document.querySelector('.caloriediv span');
  const proteinElement = document.querySelector('.proteindiv span');
  const carbsElement = document.querySelector('.carbsdiv span');
  const fatElement = document.querySelector('.fatdiv span');
  const servingSizeInput = document.querySelector('.servingsize input');
  const unitDropdown = document.getElementById('unitsdropdown');

  //Food API configuration - Updated to use USDA FoodData Central API
  const USDA_API_KEY = 'FR4wJDKvvxNG4P2H9XPggF0r4FdrsSZraV2z0BfH';
  const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
  
  //Nutrient IDs for macros (USDA standard nutrient numbers)
  const NUTRIENT_IDS = {
    CALORIES: ['1008', '208', 'Energy'],
    PROTEIN: ['1003', '203', 'Protein'],
    CARBS: ['1005', '205', 'Carbohydrate, by difference'],
    FAT: ['1004', '204', 'Total lipid (fat)']
  };
  
  //For debugging API issues
  console.log('API Configuration:', { USDA_API_KEY, USDA_BASE_URL });

  let currentDate = new Date();
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  let foodCount = 0;
  let currentContainer = null;
  let selectedFood = null;
  let searchTimeout = null;
  let dailyNutrition = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  
  const overlayDiv = document.createElement('div');
  overlayDiv.className = 'page-overlay';
  document.body.appendChild(overlayDiv);
  
  function updateDateDisplay() {
    const options = { month: 'long', day: 'numeric' };
    
    if (currentDate.getTime() === today.getTime()) {
      dateSpan.textContent = 'Today';
    } else {
      dateSpan.textContent = currentDate.toLocaleDateString('en-US', options);
    }
    
    //Load saved meal data for the selected date
    loadMealData();
  }

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  function getUserId() {
    return localStorage.getItem('userId') || '';
  }
  
  function getAuthToken() {
    return localStorage.getItem('token') || '';
  }
  
  //Function to save meal data to the backend
  async function saveMealData() {
    const userId = getUserId();
    const token = getAuthToken();
    
    console.log('Attempting to save meal data...');
    console.log('User ID:', userId);
    console.log('Token available:', !!token);
    
    const dateKey = formatDateKey(currentDate);
    console.log('Date key:', dateKey);
    
    const mealContainers = {
      breakfast: breakfastLogContainer,
      snacks: snacksLogContainer,
      lunch: lunchLogContainer,
      drinks: drinksLogContainer,
      dinner: dinnerLogContainer
    };
    
    //Collect all food items from all containers
    const allFoodItems = [];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    for (const [mealType, container] of Object.entries(mealContainers)) {
      const items = container.querySelectorAll('.foodlogitem');
      console.log(`${mealType} items:`, items.length);
      
      items.forEach(item => {
        const name = item.querySelector('#foodlogitemname').textContent;
        const servingInfo = item.querySelector('#foodlogitemservingsize').textContent;
        const calories = parseFloat(item.dataset.calories) || 0;
        const protein = parseFloat(item.dataset.protein) || 0;
        const carbs = parseFloat(item.dataset.carbs) || 0;
        const fats = parseFloat(item.dataset.fats) || 0;
        
        allFoodItems.push({
          name,
          servingInfo,
          calories,
          protein,
          carbs,
          fats,
          mealType
        });
        
        totalCalories += calories;
        totalProtein += protein;
        totalCarbs += carbs;
        totalFats += fats;
      });
    }
    
    console.log('Total food items:', allFoodItems.length);
    console.log('Total calories:', totalCalories);
    
    //Round total values
    totalCalories = Math.round(totalCalories);
    totalProtein = Math.round(totalProtein * 10) / 10;
    totalCarbs = Math.round(totalCarbs * 10) / 10;
    totalFats = Math.round(totalFats * 10) / 10;
    
    //Update daily nutrition values
    dailyNutrition = {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats
    };
    
    //Prepare meal data for API
    const mealData = {
      date: dateKey,
      mealType: 'daily',
      foodItems: allFoodItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats
    };
    
    //Always save to localStorage for persistence
    saveMealDataToLocalStorage(dateKey, mealData);
    
    //Save daily nutrition data to localStorage for dashboard synchronization
    saveDailyNutritionToLocalStorage();
    
    //Only try to save to API if user is logged in
    if (userId && token) {
      console.log('Sending meal data to API:', mealData);
      
      try {
        //Check if a meal for this date already exists
        console.log('Checking for existing meal...');
        const response = await fetch(`/api/meals/${dateKey}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });
        
        console.log('Response status:', response.status);
        const existingMeals = await response.json();
        console.log('Existing meals:', existingMeals);
        
        if (existingMeals && existingMeals.length > 0) {
          //Update existing meal
          const mealId = existingMeals[0]._id;
          console.log('Updating existing meal with ID:', mealId);
          
          const updateResponse = await fetch(`/api/meals/${mealId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify(mealData)
          });
          
          console.log('Update response status:', updateResponse.status);
          if (updateResponse.ok) {
            console.log(`Updated meal for ${dateKey}`);
          } else {
            const errorData = await updateResponse.json();
            console.error('Error updating meal:', errorData);
          }
        } else {
          //Create new meal
          console.log('Creating new meal...');
          const createResponse = await fetch('/api/meals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify(mealData)
          });
          
          console.log('Create response status:', createResponse.status);
          if (createResponse.ok) {
            console.log(`Created new meal for ${dateKey}`);
          } else {
            const errorData = await createResponse.json();
            console.error('Error creating meal:', errorData);
          }
        }
        
        //Save daily nutrition data for dashboard
        saveDailyNutrition();
        updateDashboardMealCaloriesCount(dailyNutrition.calories);
        
      } catch (error) {
        console.error('Error saving meal data to server:', error);
        console.log('Falling back to localStorage only');
      }
    } else {
      console.log('User not logged in, saving to localStorage only');
    }
  }
  
  //Function to save meal data to localStorage
  function saveMealDataToLocalStorage(dateKey, mealData) {
    try {
      //Get existing meal data from localStorage
      const storedMealData = JSON.parse(localStorage.getItem('mealData') || '{}');
      
      //Update with new data for this date
      storedMealData[dateKey] = mealData;
      
      //Save back to localStorage
      localStorage.setItem('mealData', JSON.stringify(storedMealData));
      
      console.log(`Saved meal data to localStorage for ${dateKey}`);
    } catch (error) {
      console.error('Error saving meal data to localStorage:', error);
    }
  }
  
  //Helper function to get meal items by type
  function getMealItemsByType(mealType) {
    const container = mealContainers[mealType];
    const items = [];
    
    if (container) {
      container.querySelectorAll('.foodlogitem').forEach(item => {
        const name = item.querySelector('#foodlogitemname').textContent;
        const servingInfo = item.querySelector('#foodlogitemservingsize').textContent;
        const calories = parseFloat(item.dataset.calories) || 0;
        const protein = parseFloat(item.dataset.protein) || 0;
        const carbs = parseFloat(item.dataset.carbs) || 0;
        const fats = parseFloat(item.dataset.fats) || 0;
        
        items.push({
          name,
          servingInfo,
          calories,
          protein,
          carbs,
          fats
        });
      });
    }
    
    return items;
  }
  
  //Function to load meal data from the backend or localStorage
  async function loadMealData() {
    const userId = getUserId();
    const token = getAuthToken();
    const dateKey = formatDateKey(currentDate);
    
    console.log('Attempting to load meal data...');
    console.log('Date key:', dateKey);
    
    //Clear all meal containers first
    clearAllMealContainers();
    
    //Try to load from API if user is logged in
    if (userId && token) {
      try {
        //Fetch from API
        console.log('Fetching meal data from API...');
        const response = await fetch(`/api/meals/${dateKey}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });
        
        console.log('Response status:', response.status);
        const meals = await response.json();
        console.log('Meals data:', meals);
        
        if (meals && meals.length > 0) {
          //We have meal data from the API
          const meal = meals[0];
          console.log('Processing meal data from API:', meal);
          
          //Update daily nutrition values
          dailyNutrition = {
            calories: meal.totalCalories || 0,
            protein: meal.totalProtein || 0,
            carbs: meal.totalCarbs || 0,
            fats: meal.totalFats || 0
          };
          
          console.log('Daily nutrition values from API:', dailyNutrition);
          
          //Update the UI with the food items
          if (meal.foodItems && meal.foodItems.length > 0) {
            console.log('Food items count from API:', meal.foodItems.length);
            
            //Group food items by meal type
            const breakfastItems = meal.foodItems.filter(item => item.mealType === 'breakfast');
            const snacksItems = meal.foodItems.filter(item => item.mealType === 'snacks');
            const lunchItems = meal.foodItems.filter(item => item.mealType === 'lunch');
            const drinksItems = meal.foodItems.filter(item => item.mealType === 'drinks');
            const dinnerItems = meal.foodItems.filter(item => item.mealType === 'dinner');
            
            console.log('Items per meal type from API:', {
              breakfast: breakfastItems.length,
              snacks: snacksItems.length,
              lunch: lunchItems.length,
              drinks: drinksItems.length,
              dinner: dinnerItems.length
            });
            
            if (breakfastItems.length > 0) loadMealItems(breakfastItems, breakfastLogContainer);
            if (snacksItems.length > 0) loadMealItems(snacksItems, snacksLogContainer);
            if (lunchItems.length > 0) loadMealItems(lunchItems, lunchLogContainer);
            if (drinksItems.length > 0) loadMealItems(drinksItems, drinksLogContainer);
            if (dinnerItems.length > 0) loadMealItems(dinnerItems, dinnerLogContainer);
            
            //Save API data to localStorage for future use
            saveMealDataToLocalStorage(dateKey, meal);
            
            //Save daily nutrition data to localStorage for dashboard synchronization
            saveDailyNutritionToLocalStorage();
            
            //Update the UI with total calories
            updateTotalCaloriesDisplay();
            
            console.log(`Loaded meal data from API for ${dateKey}`, meal);
            return; //Exit function after successfully loading from API
          }
        }
      } catch (error) {
        console.error('Error loading meal data from server:', error);
        console.log('Falling back to localStorage');
      }
    }
    
    //If we get here, either the user is not logged in or the API call failed
    //Try to load from localStorage
    loadMealDataFromLocalStorage(dateKey);
  }
  
  //Function to load meal data from localStorage
  function loadMealDataFromLocalStorage(dateKey) {
    try {
      //Get meal data from localStorage
      const storedMealData = JSON.parse(localStorage.getItem('mealData') || '{}');
      
      if (storedMealData[dateKey]) {
        const meal = storedMealData[dateKey];
        console.log('Processing meal data from localStorage:', meal);
        
        //Update daily nutrition values
        dailyNutrition = {
          calories: meal.totalCalories || 0,
          protein: meal.totalProtein || 0,
          carbs: meal.totalCarbs || 0,
          fats: meal.totalFats || 0
        };
        
        console.log('Daily nutrition values from localStorage:', dailyNutrition);
        
        //Update the UI with the food items
        if (meal.foodItems && meal.foodItems.length > 0) {
          console.log('Food items count from localStorage:', meal.foodItems.length);
          
          //Group food items by meal type
          const breakfastItems = meal.foodItems.filter(item => item.mealType === 'breakfast');
          const snacksItems = meal.foodItems.filter(item => item.mealType === 'snacks');
          const lunchItems = meal.foodItems.filter(item => item.mealType === 'lunch');
          const drinksItems = meal.foodItems.filter(item => item.mealType === 'drinks');
          const dinnerItems = meal.foodItems.filter(item => item.mealType === 'dinner');
          
          console.log('Items per meal type from localStorage:', {
            breakfast: breakfastItems.length,
            snacks: snacksItems.length,
            lunch: lunchItems.length,
            drinks: drinksItems.length,
            dinner: dinnerItems.length
          });
          
          if (breakfastItems.length > 0) loadMealItems(breakfastItems, breakfastLogContainer);
          if (snacksItems.length > 0) loadMealItems(snacksItems, snacksLogContainer);
          if (lunchItems.length > 0) loadMealItems(lunchItems, lunchLogContainer);
          if (drinksItems.length > 0) loadMealItems(drinksItems, drinksLogContainer);
          if (dinnerItems.length > 0) loadMealItems(dinnerItems, dinnerLogContainer);
          
          //Save daily nutrition data to localStorage for dashboard synchronization
          saveDailyNutritionToLocalStorage();
          
          //Update the UI with total calories
          updateTotalCaloriesDisplay();
          
          console.log(`Loaded meal data from localStorage for ${dateKey}`, meal);
        } else {
          console.log('No food items found in localStorage data');
          updateTotalCaloriesDisplay();
        }
      } else {
        console.log(`No meal data found in localStorage for ${dateKey}`);
        updateTotalCaloriesDisplay();
      }
    } catch (error) {
      console.error('Error loading meal data from localStorage:', error);
      updateTotalCaloriesDisplay();
    }
  }
  
  //Helper function to update the total calories display
  function updateTotalCaloriesDisplay() {
    const allFoodItems = document.querySelectorAll('.foodlogitem');
    const calorieCount = document.getElementById('caloriecountmealpage');
    
    //Calculate total calories from all food items
    let totalCalories = 0;
    allFoodItems.forEach(item => {
      totalCalories += parseInt(item.dataset.calories) || 0;
    });
    
    //Update daily nutrition values
    dailyNutrition.calories = totalCalories;
    
    //Update the meals page display
    calorieCount.textContent = allFoodItems.length > 0 ? 
      totalCalories + ' kcal' : '--';
    
    //Update chart visualization
    updateMacroChart(
      dailyNutrition.protein, 
      dailyNutrition.carbs, 
      dailyNutrition.fats
    );
    
    //Save daily nutrition data to localStorage for dashboard synchronization
    saveDailyNutritionToLocalStorage();
    
    //If we're on the dashboard page, update the UI
    if (window.location.pathname.includes('index.html')) {
      //Update calories-count element
      const caloriesCountElement = document.getElementById('calories-count');
      if (caloriesCountElement) {
        caloriesCountElement.textContent = totalCalories > 0 ? totalCalories : "0";
      }
      
      //Update recent-progress-calories element if it exists
      const recentProgressCalories = document.getElementById('recent-progress-calories');
      if (recentProgressCalories) {
        recentProgressCalories.textContent = totalCalories > 0 ? totalCalories : "0";
      }
    }
  }
  
  //Function to save daily nutrition data to localStorage for dashboard synchronization
  function saveDailyNutritionToLocalStorage() {
    const userId = getUserId();
    if (!userId) {
      console.log('No user ID found, cannot save nutrition data');
      return;
    }

    const dateKey = formatDateKey(currentDate);
    console.log('Saving nutrition data for date:', dateKey);
    
    //Ensure values are numbers and not strings
    const calories = parseInt(dailyNutrition.calories) || 0;
    const protein = parseFloat(dailyNutrition.protein) || 0;
    const carbs = parseFloat(dailyNutrition.carbs) || 0;
    const fats = parseFloat(dailyNutrition.fats) || 0;
    
    //Get the user's nutrition data
    const userNutrition = JSON.parse(localStorage.getItem(`userNutrition_${userId}`) || '{}');
    
    //Update with today's nutrition data
    userNutrition[dateKey] = {
      calories: calories,
      protein: protein,
      carbs: carbs,
      fats: fats
    };
    
    console.log('Saving updated nutrition data:', userNutrition[dateKey]);
    
    //Save back to localStorage
    localStorage.setItem(`userNutrition_${userId}`, JSON.stringify(userNutrition));
    
    //Trigger a refresh of the dashboard
    localStorage.setItem('healthai_refresh_dashboard', Date.now().toString());
    console.log('Dashboard refresh triggered');
  }
  
  function clearAllMealContainers() {
    breakfastLogContainer.innerHTML = '';
    snacksLogContainer.innerHTML = '';
    lunchLogContainer.innerHTML = '';
    drinksLogContainer.innerHTML = '';
    dinnerLogContainer.innerHTML = '';
  }
  
  function loadMealItems(items, container) {
    items.forEach(item => {
      const logItem = document.createElement('div');
      logItem.className = 'foodlogitem';
      
      //Format the macro values to handle decimal points
      const proteinValue = typeof item.protein === 'number' ? 
        (Number.isInteger(item.protein) ? item.protein : item.protein.toFixed(1)) : item.protein;
      
      const carbsValue = typeof item.carbs === 'number' ? 
        (Number.isInteger(item.carbs) ? item.carbs : item.carbs.toFixed(1)) : item.carbs;
      
      const fatsValue = typeof item.fats === 'number' ? 
        (Number.isInteger(item.fats) ? item.fats : item.fats.toFixed(1)) : item.fats;
      
      logItem.innerHTML = `
        <div class="left">
          <span id="foodlogitemname">${item.name}</span>
          <span id="foodlogitemservingsize">${item.servingInfo}</span>
        </div>
        <div class="right">
          <div class="macros">
            <span id="foodlogitemprotein">P: ${proteinValue}g</span>
            <span id="foodlogitemcarbs">C: ${carbsValue}g</span>
            <span id="foodlogitemfats">F: ${fatsValue}g</span>
          </div>
          <span id="foodlogitemcaloriecount">${item.calories} kcal</span>
          <span class="food-item-trash"><i class='bx bxs-trash'></i></span>
        </div>
      `;
      
      logItem.dataset.calories = item.calories;
      logItem.dataset.protein = item.protein;
      logItem.dataset.carbs = item.carbs;
      logItem.dataset.fats = item.fats;
      
      const trashIcon = logItem.querySelector('.food-item-trash');
      trashIcon.addEventListener('click', function() {
        logItem.style.animation = 'fadeOut 0.3s';
        
        setTimeout(() => {
          container.removeChild(logItem);
          updateTotalCalories();
          saveMealData();
        }, 300);
      });
      
      container.appendChild(logItem);
    });
  }
  
  function saveDailyNutrition() {
    const userId = getUserId();
    const token = getAuthToken();
    
    if (!userId || !token) return;
    
    const dateKey = formatDateKey(currentDate);
    
    //Save to backend API
    try {
      //Check if we already have a meal for this date
      fetch(`/api/meals/${dateKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      })
      .then(response => response.json())
      .then(meals => {
        if (meals && meals.length > 0) {
          //Update existing meal with new nutrition values
          const mealId = meals[0]._id;
          fetch(`/api/meals/${mealId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              totalCalories: dailyNutrition.calories,
              totalProtein: dailyNutrition.protein,
              totalCarbs: dailyNutrition.carbs,
              totalFats: dailyNutrition.fats
            })
          })
          .then(response => {
            if (response.ok) {
              console.log(`Updated nutrition stats for ${dateKey}`);
            }
          })
          .catch(error => {
            console.error('Error updating nutrition stats:', error);
          });
        } else {
          //Create a new meal with just the nutrition values
          fetch('/api/meals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            },
            body: JSON.stringify({
              date: dateKey,
              mealType: 'daily',
              foodItems: [],
              totalCalories: dailyNutrition.calories,
              totalProtein: dailyNutrition.protein,
              totalCarbs: dailyNutrition.carbs,
              totalFats: dailyNutrition.fats
            })
          })
          .then(response => {
            if (response.ok) {
              console.log(`Created new meal with nutrition stats for ${dateKey}`);
            }
          })
          .catch(error => {
            console.error('Error creating meal with nutrition stats:', error);
          });
        }
      })
      .catch(error => {
        console.error('Error checking for existing meal:', error);
      });
    } catch (error) {
      console.error('Error saving nutrition data to server:', error);
    }
  }
  
  function updateTotalCalories() {
    const allFoodItems = document.querySelectorAll('.foodlogitem');
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    allFoodItems.forEach(item => {
      totalCalories += parseFloat(item.dataset.calories) || 0;
      totalProtein += parseFloat(item.dataset.protein) || 0;
      totalCarbs += parseFloat(item.dataset.carbs) || 0;
      totalFats += parseFloat(item.dataset.fats) || 0;
    });
    
    //Round total values
    totalCalories = Math.round(totalCalories);
    totalProtein = Math.round(totalProtein * 10) / 10;
    totalCarbs = Math.round(totalCarbs * 10) / 10;
    totalFats = Math.round(totalFats * 10) / 10;
    
    //Update the meals page display - show just the number without 'kcal'
    calorieCount.textContent = allFoodItems.length > 0 ? totalCalories : "0";
    
    //Update daily nutrition values
    dailyNutrition = {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats
    };
    
    //Save dailyNutrition to localStorage for AI access
    localStorage.setItem('dailyNutrition', JSON.stringify(dailyNutrition));
    
    //Update chart visualization
    updateMacroChart(totalProtein, totalCarbs, totalFats);
    
    //Update dashboard with meal calories
    updateDashboardMealCaloriesCount(totalCalories);
    
    //Save nutrition data to localStorage for dashboard synchronization
    saveDailyNutritionToLocalStorage();
    
    //Also save to backend if needed
    saveDailyNutrition();
  }
  
  function updateMacroChart(protein, carbs, fats) {
    const chartInstance = Chart.getChart('macroChart');
    
    if (chartInstance) {
      const totalGrams = protein + carbs + fats;
      
      chartInstance.data.datasets[0].data = [protein, carbs, fats];
      
      if (totalGrams > 0) {
        const proteinPercentage = (protein / totalGrams * 100).toFixed(1);
        const carbsPercentage = (carbs / totalGrams * 100).toFixed(1);
        const fatsPercentage = (fats / totalGrams * 100).toFixed(1);
        
        chartInstance.data.datasets[1].data = [proteinPercentage, carbsPercentage, fatsPercentage];
      } else {
        chartInstance.data.datasets[1].data = [0, 0, 0];
      }
      
      const maxGrams = Math.max(protein, carbs, fats);
      if (maxGrams > 0) {
        const newMax = Math.ceil(maxGrams / 10) * 10;
        chartInstance.options.scales.x.max = Math.max(newMax, 100);
      } else {
        chartInstance.options.scales.x.max = 100;
      }
      
      chartInstance.update();
    }
  }
  
  function openSearchMeals(container) {
    currentContainer = container;
    searchMealsDiv.classList.add('active');
    document.getElementById('mealOverlay').classList.add('active');
    foodSearchInput.value = '';
    clearFoodInfo();
    clearSearchResults();
    foodSearchInput.focus();
  }
  
  function closeSearchMeals() {
    searchMealsDiv.classList.remove('active');
    document.getElementById('mealOverlay').classList.remove('active');
    currentContainer = null;
    selectedFood = null;
    clearFoodInfo();
    clearSearchResults();
  }
  
  function clearFoodInfo() {
    foodNameElement.textContent = 'Meal Name';
    caloriesElement.textContent = '--';
    proteinElement.textContent = '--';
    carbsElement.textContent = '--';
    fatElement.textContent = '--';
    servingSizeInput.value = '';
    selectedFood = null;
  }
  
  function clearSearchResults() {
    mealSuggestionsList.innerHTML = '';
  }
  
  function displayFoodDetails(foodData) {
    selectedFood = foodData;
    
    //Handle case where food data is incomplete
    if (!foodData) {
      console.error('No food data available to display');
      clearFoodInfo();
      return;
    }
    
    //Set food name and nutrition info
    foodNameElement.textContent = foodData.name || 'Unknown Food';
    
    //Store the base values for real-time updates (per 100g)
    selectedFood.baseCalories = foodData.calories;
    selectedFood.baseProtein = foodData.protein;
    selectedFood.baseCarbs = foodData.carbs;
    selectedFood.baseFats = foodData.fats;
    
    //Initial values (will be updated in updateNutritionDisplay)
    updateNutritionDisplay();
    
    //Set default serving size if available
    servingSizeInput.value = foodData.serving || 100;
    
    //Set the unit dropdown
    let unitFound = false;
    for (let i = 0; i < unitDropdown.options.length; i++) {
      const optionText = unitDropdown.options[i].text.toLowerCase();
      const foodUnit = (foodData.unit || 'g').toLowerCase();
      
      if (optionText === foodUnit || 
          (foodUnit === 'gram' && optionText === 'g') || 
          (foodUnit === 'g' && optionText === 'gram')) {
        unitDropdown.selectedIndex = i;
        unitFound = true;
        break;
      }
    }
    
    //Default to grams if unit not found
    if (!unitFound) {
      for (let i = 0; i < unitDropdown.options.length; i++) {
        if (unitDropdown.options[i].text.toLowerCase() === 'g') {
          unitDropdown.selectedIndex = i;
          break;
        }
      }
    }
    
    //Add event listeners to update nutrition when serving size changes
    setupServingSizeListeners();
    
    //Log the displayed food data for debugging
    console.log('Displaying food details:', foodData);
  }
  
  //Function to update nutrition display based on serving size and unit
  function updateNutritionDisplay() {
    if (!selectedFood) return;
    
    const servingSize = parseFloat(servingSizeInput.value) || 0;
    const unit = unitDropdown.options[unitDropdown.selectedIndex].text;
    
    //Get the conversion factor based on the selected unit
    const conversionFactor = getConversionFactor(unit);
    
    //Calculate nutrient values based on the serving size and unit
    const grams = servingSize * conversionFactor;
    const ratio = grams / 100; //Base values are per 100g
    
    //Calculate values with the ratio
    let calories, protein, carbs, fats;
    
    //Special handling for very small amounts (like milligrams)
    if (unit.toLowerCase() === 'mg' || unit.toLowerCase() === 'milligram' || unit.toLowerCase() === 'milligrams') {
      //For milligrams, calculate per 1000mg (1g) and then adjust
      const mgRatio = servingSize / 1000; //1000mg = 1g
      calories = Math.round(selectedFood.baseCalories * mgRatio);
      protein = Math.round(selectedFood.baseProtein * mgRatio * 100) / 100;
      carbs = Math.round(selectedFood.baseCarbs * mgRatio * 100) / 100;
      fats = Math.round(selectedFood.baseFats * mgRatio * 100) / 100;
      
      //Use trace amounts if values are too small but not zero
      calories = calories === 0 && selectedFood.baseCalories > 0 ? "<1" : calories;
      protein = protein === 0 && selectedFood.baseProtein > 0 ? "<0.1" : protein;
      carbs = carbs === 0 && selectedFood.baseCarbs > 0 ? "<0.1" : carbs;
      fats = fats === 0 && selectedFood.baseFats > 0 ? "<0.1" : fats;
    } else {
      //Normal calculation for other units
      calories = Math.round(selectedFood.baseCalories * ratio);
      protein = Math.round(selectedFood.baseProtein * ratio * 10) / 10;
      carbs = Math.round(selectedFood.baseCarbs * ratio * 10) / 10;
      fats = Math.round(selectedFood.baseFats * ratio * 10) / 10;
    }
    
    //Update the display
    caloriesElement.textContent = `${calories} kcal`;
    proteinElement.textContent = `${protein}g`;
    carbsElement.textContent = `${carbs}g`;
    fatElement.textContent = `${fats}g`;
    
    //For storing in object, convert "<0.1" strings to numeric values
    const numericCalories = typeof calories === 'string' ? 1 : calories;
    const numericProtein = typeof protein === 'string' ? 0.1 : protein;
    const numericCarbs = typeof carbs === 'string' ? 0.1 : carbs;
    const numericFats = typeof fats === 'string' ? 0.1 : fats;
    
    //Update the selectedFood object with these calculated values
    selectedFood.calories = numericCalories;
    selectedFood.protein = numericProtein;
    selectedFood.carbs = numericCarbs;
    selectedFood.fats = numericFats;
    selectedFood.serving = servingSize;
    selectedFood.unit = unit;
    
    console.log(`Updated nutrition for ${servingSize}${unit}:`, { calories, protein, carbs, fats, grams, ratio });
  }
  
  //Get the conversion factor to convert units to grams
  function getConversionFactor(unit) {
    unit = unit.toLowerCase();
    
    switch (unit) {
      case 'g':
      case 'gram':
      case 'grams':
        return 1; //1g = 1g
      case 'oz':
      case 'ounce':
      case 'ounces':
        return 28.35; //1oz = 28.35g
      case 'mg':
      case 'milligram':
      case 'milligrams':
        return 0.001; //1mg = 0.001g (1000mg = 1g)
      case 'lb':
      case 'pound':
      case 'pounds':
        return 453.59; //1lb = 453.59g
      default:
        console.warn(`Unknown unit: ${unit}, defaulting to grams`);
        return 1;
    }
  }
  
  //Setup listeners for serving size and unit changes
  function setupServingSizeListeners() {
    //Remove previous listeners to avoid duplicates
    servingSizeInput.removeEventListener('input', updateNutritionDisplay);
    unitDropdown.removeEventListener('change', updateNutritionDisplay);
    
    //Add new listeners
    servingSizeInput.addEventListener('input', updateNutritionDisplay);
    unitDropdown.addEventListener('change', updateNutritionDisplay);
  }
  
  function createFoodLogItem(container, foodItem) {
    if (!foodItem) return;
    
    foodCount++;
    
    const logItem = document.createElement('div');
    logItem.className = 'foodlogitem';
    
    //Get serving size and unit
    const servingSize = parseFloat(servingSizeInput.value) || foodItem.serving;
    const unit = unitDropdown.options[unitDropdown.selectedIndex].text;
    
    //Get the conversion factor based on the selected unit
    const conversionFactor = getConversionFactor(unit);
    
    //Calculate the grams for this serving
    const grams = servingSize * conversionFactor;
    
    //Calculate nutrient values based on the grams
    //Base values are per 100g, so ratio = grams/100
    const ratio = grams / 100;
    
    //For milligrams, ensure we don't drop to zero due to rounding
    let calories, protein, carbs, fats;
    
    //Special handling for very small amounts (like milligrams)
    if (unit.toLowerCase() === 'mg' || unit.toLowerCase() === 'milligram' || unit.toLowerCase() === 'milligrams') {
      //For milligrams, calculate per 1000mg (1g) and then adjust
      const mgRatio = servingSize / 1000; //1000mg = 1g
      calories = Math.round(foodItem.baseCalories * mgRatio);
      protein = Math.round(foodItem.baseProtein * mgRatio * 100) / 100;
      carbs = Math.round(foodItem.baseCarbs * mgRatio * 100) / 100;
      fats = Math.round(foodItem.baseFats * mgRatio * 100) / 100;
      
      //Use trace amounts if values are too small but not zero
      calories = calories === 0 && foodItem.baseCalories > 0 ? "<1" : calories;
      protein = protein === 0 && foodItem.baseProtein > 0 ? "<0.1" : protein;
      carbs = carbs === 0 && foodItem.baseCarbs > 0 ? "<0.1" : carbs;
      fats = fats === 0 && foodItem.baseFats > 0 ? "<0.1" : fats;
    } else {
      //Normal calculation for other units
      calories = Math.round(foodItem.baseCalories * ratio);
      protein = Math.round(foodItem.baseProtein * ratio * 10) / 10;
      carbs = Math.round(foodItem.baseCarbs * ratio * 10) / 10;
      fats = Math.round(foodItem.baseFats * ratio * 10) / 10;
    }
    
    logItem.innerHTML = `
      <div class="left">
        <span id="foodlogitemname">${foodItem.name}</span>
        <span id="foodlogitemservingsize">${servingSize} ${unit}</span>
      </div>
      <div class="right">
        <div class="macros">
          <span id="foodlogitemprotein">P: ${protein}g</span>
          <span id="foodlogitemcarbs">C: ${carbs}g</span>
          <span id="foodlogitemfats">F: ${fats}g</span>
        </div>
        <span id="foodlogitemcaloriecount">${calories} kcal</span>
        <span class="food-item-trash"><i class='bx bxs-trash'></i></span>
      </div>
    `;
    
    //For storing in dataset, convert "<0.1" strings to numeric values
    const numericCalories = typeof calories === 'string' ? 0 : calories;
    const numericProtein = typeof protein === 'string' ? 0 : protein;
    const numericCarbs = typeof carbs === 'string' ? 0 : carbs;
    const numericFats = typeof fats === 'string' ? 0 : fats;
    
    logItem.dataset.calories = numericCalories;
    logItem.dataset.protein = numericProtein;
    logItem.dataset.carbs = numericCarbs;
    logItem.dataset.fats = numericFats;
    
    //Determine which meal type this item belongs to based on the container
    let mealType = 'breakfast';
    if (container === breakfastLogContainer) mealType = 'breakfast';
    else if (container === snacksLogContainer) mealType = 'snacks';
    else if (container === lunchLogContainer) mealType = 'lunch';
    else if (container === drinksLogContainer) mealType = 'drinks';
    else if (container === dinnerLogContainer) mealType = 'dinner';
    
    //Store the meal type in the dataset
    logItem.dataset.mealType = mealType;
    
    const trashIcon = logItem.querySelector('.food-item-trash');
    trashIcon.addEventListener('click', function() {
      logItem.style.animation = 'fadeOut 0.3s';
      
      setTimeout(() => {
        container.removeChild(logItem);
        updateTotalCalories();
        saveMealData();
      }, 300);
    });
    
    container.prepend(logItem);
    updateTotalCalories();
    saveMealData();
  }
  
  //Initialize
  updateDateDisplay();
  loadMealData();
  
  //Save data when user leaves the page
  window.addEventListener('beforeunload', () => {
    saveMealData();
  });
  
  //Test API connectivity on page load
  testApiConnectivity();
  
  //Function to test API connectivity
  async function testApiConnectivity() {
    try {
      console.log('Testing USDA API connectivity...');
      const testQuery = 'apple';
      
      //Build the URL with query parameters
      const testUrl = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(testQuery)}&pageSize=1`;
      
      const response = await fetch(testUrl);
      
      if (!response.ok) {
        console.error(`USDA API connectivity test failed: ${response.status} ${response.statusText}`);
        //Add sample data for testing if API is not available
        window.useFallbackData = true;
        console.warn('Using fallback data for food search due to API connectivity issues');
      } else {
        const data = await response.json();
        console.log('USDA API connectivity test successful:', data);
        window.useFallbackData = false;
      }
    } catch (error) {
      console.error('USDA API connectivity test error:', error);
      window.useFallbackData = true;
      console.warn('Using fallback data for food search due to API connectivity issues');
    }
  }
  
  //Fallback data for when API is not available
  const fallbackFoods = [
    {
      name: 'Apple',
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fats: 0.3,
      baseCalories: 95,
      baseProtein: 0.5,
      baseCarbs: 25,
      baseFats: 0.3,
      serving: 100,
      unit: 'g',
      category: 'Fruits'
    },
    {
      name: 'Banana',
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fats: 0.4,
      baseCalories: 105,
      baseProtein: 1.3,
      baseCarbs: 27,
      baseFats: 0.4,
      serving: 100,
      unit: 'g',
      category: 'Fruits'
    },
    {
      name: 'Chicken Breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fats: 3.6,
      baseCalories: 165,
      baseProtein: 31,
      baseCarbs: 0,
      baseFats: 3.6,
      serving: 100,
      unit: 'g',
      category: 'Poultry'
    },
    {
      name: 'Eggs',
      calories: 143,
      protein: 13,
      carbs: 0.7,
      fats: 9.5,
      serving: 100,
      unit: 'g',
      category: 'Eggs & Dairy'
    },
    {
      name: 'Brown Rice',
      calories: 112,
      protein: 2.6,
      carbs: 24,
      fats: 0.8,
      serving: 100,
      unit: 'g',
      category: 'Grains'
    },
    {
      name: 'Salmon',
      calories: 208,
      protein: 20,
      carbs: 0,
      fats: 13,
      serving: 100,
      unit: 'g',
      category: 'Fish'
    },
    {
      name: 'Avocado',
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fats: 14.7,
      serving: 100,
      unit: 'g',
      category: 'Fruits'
    },
    {
      name: 'Broccoli',
      calories: 34,
      protein: 2.8,
      carbs: 6.6,
      fats: 0.4,
      serving: 100,
      unit: 'g',
      category: 'Vegetables'
    },
    {
      name: 'Yogurt (Greek)',
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fats: 0.4,
      serving: 100,
      unit: 'g',
      category: 'Dairy'
    },
    {
      name: 'Spinach',
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fats: 0.4,
      serving: 100,
      unit: 'g',
      category: 'Vegetables'
    },
    {
      name: 'Sweet Potato',
      calories: 86,
      protein: 1.6,
      carbs: 20.1,
      fats: 0.1,
      serving: 100,
      unit: 'g',
      category: 'Vegetables'
    },
    {
      name: 'Almonds',
      calories: 579,
      protein: 21.2,
      carbs: 21.7,
      fats: 49.9,
      serving: 100,
      unit: 'g',
      category: 'Nuts'
    },
    {
      name: 'Oatmeal',
      calories: 68,
      protein: 2.4,
      carbs: 12,
      fats: 1.4,
      serving: 100,
      unit: 'g',
      category: 'Grains'
    },
    {
      name: 'Milk (whole)',
      calories: 61,
      protein: 3.2,
      carbs: 4.8,
      fats: 3.3,
      serving: 100,
      unit: 'g',
      category: 'Dairy'
    },
    {
      name: 'Pasta (cooked)',
      calories: 158,
      protein: 5.8,
      carbs: 31,
      fats: 0.9,
      serving: 100,
      unit: 'g',
      category: 'Grains'
    }
  ];
  
  //Search for food using the USDA FoodData Central API
  async function searchFoods(query) {
    if (!query || query.trim() === '') {
      clearSearchResults();
      return;
    }

    try {
      //Display loading message
      mealSuggestionsList.innerHTML = '<div class="suggestionsdiv loading"><i class="fa-solid fa-spinner fa-spin"></i> Searching for foods...</div>';
      
      //If we're using fallback data (API not working)
      if (window.useFallbackData) {
        console.log('Using fallback data for search');
        setTimeout(() => {
          const filteredFoods = fallbackFoods.filter(food => 
            food.name.toLowerCase().includes(query.toLowerCase())
          );
          
          if (filteredFoods.length === 0) {
            displayNoResults();
          } else {
            displayFallbackResults(filteredFoods, query);
          }
        }, 500); //Simulate API delay
        return;
      }
      
      console.log(`Searching for food with query: ${query}`);
      
      //Build the URL with query parameters
      const searchUrl = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`;
      
      //Make the API request
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        //Switch to fallback data for this session
        window.useFallbackData = true;
        //Retry search with fallback data
        searchFoods(query);
        return;
      }
      
      const data = await response.json();
      console.log('USDA API Response:', data);
      
      if (!data.foods || data.foods.length === 0) {
        displayNoResults();
        return;
      }
      
      displaySearchResults(data.foods);
    } catch (error) {
      console.error('Error searching for foods:', error);
      //Switch to fallback data for this session
      window.useFallbackData = true;
      //Retry search with fallback data
      searchFoods(query);
    }
  }
  
  //Display search results from USDA API in the UI
  function displaySearchResults(foods) {
    clearSearchResults();
    
    if (!foods || foods.length === 0) {
      displayNoResults();
      return;
    }
    
    console.log(`Displaying ${foods.length} search results`);
    
    foods.forEach(food => {
      if (!food) {
        console.warn('Invalid food item in search results');
        return;
      }
      
      const foodDiv = document.createElement('div');
      foodDiv.className = 'suggestionsdiv';
      foodDiv.id = 'mealsuggestionsdiv';
      
      //Format food name with brand if available
      let foodName = food.description || 'Unknown Food';
      let brandOwner = food.brandOwner || food.brandName || '';
      let category = food.foodCategory || '';
      
      //Add brand if available
      const brandText = brandOwner ? ` (${brandOwner})` : '';
      //Add category if available
      const categoryText = category ? ` - ${category}` : '';
      
      foodDiv.innerHTML = `<i class="fa-solid fa-utensils"></i> ${foodName}${brandText}${categoryText}`;
      
      //Store the food ID for later retrieval of detailed info
      const foodData = {
        id: food.fdcId,
        name: foodName + brandText,
        category: category,
        //We'll fetch detailed nutrition when the item is selected
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        serving: 100,
        unit: 'g'
      };
      
      foodDiv.dataset.food = JSON.stringify(foodData);
      
      foodDiv.addEventListener('click', async () => {
        //Set all suggestion divs to inactive
        document.querySelectorAll('.suggestionsdiv').forEach(div => {
          div.classList.remove('active');
        });
        
        //Set this one to active
        foodDiv.classList.add('active');
        
        //Fetch detailed nutrition data for this food
        await getFoodDetails(food.fdcId, foodDiv);
      });
      
      mealSuggestionsList.appendChild(foodDiv);
    });
    
    //Add event listeners to handle keyboard navigation for accessibility
    const suggestionDivs = document.querySelectorAll('.suggestionsdiv');
    if (suggestionDivs.length > 0) {
      suggestionDivs[0].classList.add('active');
      getFoodDetails(JSON.parse(suggestionDivs[0].dataset.food).id, suggestionDivs[0]);
    }
  }
  
  //Get detailed nutrition information for a specific food
  async function getFoodDetails(fdcId, foodDiv) {
    try {
      //Show loading state in the nutrition info area
      foodNameElement.textContent = 'Loading...';
      caloriesElement.textContent = '--';
      proteinElement.textContent = '--';
      carbsElement.textContent = '--';
      fatElement.textContent = '--';
      
      //Build the URL for food details
      const detailsUrl = `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}&format=full`;
      
      //Make the API request
      const response = await fetch(detailsUrl);
      
      if (!response.ok) {
        console.error(`API Error getting food details: ${response.status} ${response.statusText}`);
        //Get the basic food data we already have
        const basicFoodData = JSON.parse(foodDiv.dataset.food);
        displayFoodDetails(basicFoodData);
        return;
      }
      
      const data = await response.json();
      console.log('Food details response:', data);
      
      //Extract nutrient data
      const nutrients = data.foodNutrients || [];
      const foodData = JSON.parse(foodDiv.dataset.food);
      
      //Extract serving size information
      let servingSize = 100; //Default to 100g for standardization
      let servingUnit = 'g';
      
      if (data.servingSize && data.servingSizeUnit) {
        //Store the API provided serving size, but we'll still normalize to per 100g
        servingSize = data.servingSize;
        servingUnit = data.servingSizeUnit;
      } else if (data.foodPortions && data.foodPortions.length > 0) {
        const portion = data.foodPortions[0];
        if (portion.amount && portion.measureUnit?.name) {
          servingSize = portion.amount;
          servingUnit = portion.measureUnit.name;
        }
      }
      
      //Extract nutrients and store them as base values (per 100g)
      let calories = 0, protein = 0, carbs = 0, fats = 0;
      nutrients.forEach(nutrient => {
        const nutrientNumber = nutrient.nutrient?.number || '';
        const nutrientName = nutrient.nutrient?.name || '';
        const value = nutrient.amount || 0;
        
        if (NUTRIENT_IDS.CALORIES.includes(nutrientNumber) || 
            NUTRIENT_IDS.CALORIES.includes(nutrientName)) {
          calories = value;
        } else if (NUTRIENT_IDS.PROTEIN.includes(nutrientNumber) || 
                  NUTRIENT_IDS.PROTEIN.includes(nutrientName)) {
          protein = value;
        } else if (NUTRIENT_IDS.CARBS.includes(nutrientNumber) || 
                  NUTRIENT_IDS.CARBS.includes(nutrientName)) {
          carbs = value;
        } else if (NUTRIENT_IDS.FAT.includes(nutrientNumber) || 
                  NUTRIENT_IDS.FAT.includes(nutrientName)) {
          fats = value;
        }
      });
      
      //If the API gives values for a different serving size than 100g,
      //convert to per 100g for consistent calculations
      if (servingUnit.toLowerCase() !== 'g' || servingSize !== 100) {
        const conversionFactor = getConversionFactor(servingUnit);
        const gramsPerServing = servingSize * conversionFactor;
        const ratioTo100g = 100 / gramsPerServing;
        
        //Normalize to per 100g
        calories *= ratioTo100g;
        protein *= ratioTo100g;
        carbs *= ratioTo100g;
        fats *= ratioTo100g;
        
        console.log(`Normalized nutrients from ${servingSize}${servingUnit} to per 100g`);
      }
      
      //Store the normalized values (per 100g) in the food data
      foodData.baseCalories = Math.round(calories);
      foodData.baseProtein = Math.round(protein * 10) / 10;
      foodData.baseCarbs = Math.round(carbs * 10) / 10;
      foodData.baseFats = Math.round(fats * 10) / 10;
      
      //Also store the current values (which will be updated in displayFoodDetails)
      foodData.calories = foodData.baseCalories;
      foodData.protein = foodData.baseProtein;
      foodData.carbs = foodData.baseCarbs;
      foodData.fats = foodData.baseFats;
      
      //Default to 100g for the displayed serving size
      foodData.serving = 100;
      foodData.unit = 'g';
      
      //Update the food div with complete data
      foodDiv.dataset.food = JSON.stringify(foodData);
      
      //Display the food details
      displayFoodDetails(foodData);
      
    } catch (error) {
      console.error('Error fetching food details:', error);
      //Use the basic food data we already have
      const basicFoodData = JSON.parse(foodDiv.dataset.food);
      displayFoodDetails(basicFoodData);
    }
  }

  //Display fallback results when API is not available
  function displayFallbackResults(foods, query) {
    clearSearchResults();
    
    if (foods.length === 0) {
      displayNoResults();
      return;
    }
    
    foods.forEach(food => {
      const foodDiv = document.createElement('div');
      foodDiv.className = 'suggestionsdiv';
      foodDiv.id = 'mealsuggestionsdiv';
      
      const categoryText = food.category ? ` - ${food.category}` : '';
      foodDiv.innerHTML = `<i class="fa-solid fa-utensils"></i> ${food.name}${categoryText}`;
      
      //Ensure the food has base values for proper conversions
      if (!food.baseCalories) {
        food.baseCalories = food.calories;
        food.baseProtein = food.protein;
        food.baseCarbs = food.carbs;
        food.baseFats = food.fats;
      }
      
      foodDiv.dataset.food = JSON.stringify(food);
      
      foodDiv.addEventListener('click', () => {
        //Set all suggestion divs to inactive
        document.querySelectorAll('.suggestionsdiv').forEach(div => {
          div.classList.remove('active');
        });
        
        //Set this one to active
        foodDiv.classList.add('active');
        
        //Display food details
        displayFoodDetails(food);
      });
      
      mealSuggestionsList.appendChild(foodDiv);
    });
    
    //Select the first item by default
    const suggestionDivs = document.querySelectorAll('.suggestionsdiv');
    if (suggestionDivs.length > 0) {
      suggestionDivs[0].classList.add('active');
      displayFoodDetails(JSON.parse(suggestionDivs[0].dataset.food));
    }
  }
  
  function displayNoResults() {
    clearSearchResults();
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'suggestionsdiv no-results';
    noResultsDiv.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> No results found';
    mealSuggestionsList.appendChild(noResultsDiv);
  }
  
  function displayErrorMessage(message) {
    clearSearchResults();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'suggestionsdiv error-message';
    errorDiv.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> ${message}`;
    mealSuggestionsList.appendChild(errorDiv);
  }
  
  //Event listeners for the food search
  foodSearchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    
    //Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    //Set new timeout to prevent too many API calls while typing
    searchTimeout = setTimeout(() => {
      searchFoods(query);
    }, 500);
  });
  
  searchBtn.addEventListener('click', function() {
    const query = foodSearchInput.value.trim();
    searchFoods(query);
  });
  
  //Add event listener for enter key in search input
  foodSearchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      searchFoods(query);
    }
  });
  
  //Update meal sections event listeners
  breakfastAddBtn.addEventListener('click', function() {
    openSearchMeals(breakfastLogContainer);
  });
  
  snacksAddBtn.addEventListener('click', function() {
    openSearchMeals(snacksLogContainer);
  });
  
  lunchaddbtn.addEventListener('click', function() {
    openSearchMeals(lunchLogContainer);
  });
  
  drinksaddbtn.addEventListener('click', function() {
    openSearchMeals(drinksLogContainer);
  });
  
  dinneraddbtn.addEventListener('click', function() {
    openSearchMeals(dinnerLogContainer);
  });
  
  //Add food button
  addFoodBtn.addEventListener('click', function() {
    if (currentContainer && selectedFood) {
      createFoodLogItem(currentContainer, selectedFood);
      closeSearchMeals();
    } else {
      alert('Please select a food item first');
    }
  });
  
  closeFoodBtn.addEventListener('click', closeSearchMeals);
  
  //Date navigation
  yesterdayBtn.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
    loadMealData();
  });
  
  tomorrowBtn.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
    loadMealData();
  });
  
  //Initialize the macro chart
  const ctx = document.getElementById('macroChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Protein', 'Carbs', 'Fats'],
      datasets: [
        {
          label: 'Grams',
          data: [0, 0, 0],
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
          data: [0, 0, 0],
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

  //Function to check if user is logged in and load their data
  function checkUserLogin() {
    const userId = getUserId();
    if (userId) {
      console.log(`User ${userId} is logged in, loading meal data`);
      loadMealData();
    } else {
      console.log('No user logged in, meal data will not be loaded');
    }
  }

  //Initialize
  updateDateDisplay();
  checkUserLogin();

  //Add event listener for visibility change to save data when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      saveMealData();
    }
  });

  //Function to remove a food item from the log
  function removeFoodItem(item) {
    //Get the container that the item is in
    const container = item.parentElement;
    
    //Remove the item from the container
    container.removeChild(item);
    
    //Update the total calories display
    updateTotalCaloriesDisplay();
    
    //Save the updated meal data
    saveMealData();
    
    //Save daily nutrition data to localStorage for dashboard synchronization
    saveDailyNutritionToLocalStorage();
  }

  //Function to update dashboard meal calories count
  function updateDashboardMealCaloriesCount(totalCalories) {
    //Get the current date as a string (YYYY-MM-DD)
    const dateString = currentDate.toISOString().split('T')[0];
    
    //Get user data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || (userData.profile && userData.profile._id);
    
    if (!userId) {
      console.log('No user ID found, cannot save meal data to dashboard');
      return;
    }
    
    //Get existing nutrition data from local storage
    const userNutrition = JSON.parse(localStorage.getItem(`userNutrition_${userId}`) || '{}');
    
    //Create or update data for the current date
    if (!userNutrition[dateString]) {
      userNutrition[dateString] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        exerciseCalories: 0
      };
    }
    
    //Update meal calories
    userNutrition[dateString].calories = totalCalories;
    
    //Save to local storage
    localStorage.setItem(`userNutrition_${userId}`, JSON.stringify(userNutrition));
    
    //Also save to the specific meal key for backward compatibility
    localStorage.setItem(`healthai_meals_${userId}`, totalCalories);
    
    //Trigger a dashboard refresh
    localStorage.setItem('healthai_refresh_dashboard', Date.now().toString());
    
    //If we're on the dashboard page, update the UI
    if (window.location.pathname.includes('index.html')) {
      //Update calories-count element
      const caloriesCountElement = document.getElementById('calories-count');
      if (caloriesCountElement) {
        caloriesCountElement.textContent = totalCalories > 0 ? totalCalories : "0";
      }
      
      //Update recent-progress-calories element if it exists
      const recentProgressCalories = document.getElementById('recent-progress-calories');
      if (recentProgressCalories) {
        recentProgressCalories.textContent = totalCalories > 0 ? totalCalories : "0";
      }
    }
    
    //Also update the meals page display if we're on the meals page
    if (window.location.pathname.includes('meal.html')) {
      const calorieCountMealPage = document.getElementById('caloriecountmealpage');
      if (calorieCountMealPage) {
        calorieCountMealPage.textContent = totalCalories > 0 ? totalCalories : "0";
      }
    }
  }
});