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
  
  const breakfastLogContainer = document.querySelector('.breakfastlog-container');
  const snacksLogContainer = document.querySelector('.snackslog-container');
  const lunchLogContainer = document.querySelector('.lunchlog-container');
  const drinksLogContainer = document.querySelector('.drinkslog-container');
  const dinnerLogContainer = document.querySelector('.dinnerlog-container');

  const calorieCount = document.getElementById('caloriecountmealpage');

  let currentDate = new Date();
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  function updateDateDisplay() {
    const options = { month: 'long', day: 'numeric' };
    
    if (currentDate.getTime() === today.getTime()) {
      dateSpan.textContent = 'Today';
    } else {
      dateSpan.textContent = currentDate.toLocaleDateString('en-US', options);
    }
  }
  
  updateDateDisplay();
  
  yesterdayBtn.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
  });
  
  tomorrowBtn.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
  });

  let foodCount = 0;
  let currentContainer = null;
  
  const overlayDiv = document.createElement('div');
  overlayDiv.className = 'page-overlay';
  document.body.appendChild(overlayDiv);
  
  function updateTotalCalories() {
    const allFoodItems = document.querySelectorAll('.foodlogitem');
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    allFoodItems.forEach(item => {
      totalCalories += parseInt(item.dataset.calories);
      totalProtein += parseInt(item.dataset.protein);
      totalCarbs += parseInt(item.dataset.carbs);
      totalFats += parseInt(item.dataset.fats);
    });
    
    calorieCount.textContent = allFoodItems.length > 0 ? totalCalories + ' kcal' : '--';
    
    const chartInstance = Chart.getChart('macroChart');
    
    if (chartInstance) {
      const totalGrams = totalProtein + totalCarbs + totalFats;
      
      chartInstance.data.datasets[0].data = [totalProtein, totalCarbs, totalFats];
      
      if (totalGrams > 0) {
        const proteinPercentage = (totalProtein / totalGrams * 100).toFixed(1);
        const carbsPercentage = (totalCarbs / totalGrams * 100).toFixed(1);
        const fatsPercentage = (totalFats / totalGrams * 100).toFixed(1);
        
        chartInstance.data.datasets[1].data = [proteinPercentage, carbsPercentage, fatsPercentage];
      } else {
        chartInstance.data.datasets[1].data = [0, 0, 0];
      }
      
      const maxGrams = Math.max(totalProtein, totalCarbs, totalFats);
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
    searchMealsDiv.style.visibility = 'visible';
    searchMealsDiv.style.opacity = '1';
    searchMealsDiv.classList.add('search-food-visible');
    overlayDiv.style.display = 'block';
  }
  
  function closeSearchMeals() {
    searchMealsDiv.style.opacity = '0';
    overlayDiv.style.display = 'none';
    setTimeout(function() {
      searchMealsDiv.style.visibility = 'hidden';
      searchMealsDiv.classList.remove('search-food-visible');
    }, 500);
  }
  
  function createFoodLogItem(container) {
    foodCount++;
    
    const now = new Date();
    const dateTimeStr = now.toLocaleString();
    
    const calories = Math.floor(Math.random() * 400) + 100;
    const servingSize = Math.floor(Math.random() * 400) + 100;
    const protein = Math.floor(Math.random() * 30) + 5;
    const carbs = Math.floor(Math.random() * 50) + 10;
    const fats = Math.floor(Math.random() * 20) + 3;
    
    const logItem = document.createElement('div');
    logItem.className = 'foodlogitem';
    
    const foodNames = ['Chicken Shawarma', 'Grilled Salmon', 'Caesar Salad', 'Quinoa Bowl', 'Avocado Toast', 'Greek Yogurt'];
    const foodName = foodNames[Math.floor(Math.random() * foodNames.length)];
    
    logItem.innerHTML = `
      <div class="left">
        <span id="foodlogitemname">${foodName}</span>
        <span id="foodlogitemservingsize">${servingSize} g</span>
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
    
    logItem.dataset.calories = calories;
    logItem.dataset.protein = protein;
    logItem.dataset.carbs = carbs;
    logItem.dataset.fats = fats;
    
    const trashIcon = logItem.querySelector('.food-item-trash');
    trashIcon.addEventListener('click', function() {
      logItem.style.animation = 'fadeOut 0.3s';
      
      setTimeout(() => {
        container.removeChild(logItem);
        updateTotalCalories();
      }, 300);
    });
    
    container.prepend(logItem);
    updateTotalCalories();
  }
  
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
  
  addFoodBtn.addEventListener('click', function() {
    if (currentContainer) {
      createFoodLogItem(currentContainer);
      closeSearchMeals();
    }
  });
  
  closeFoodBtn.addEventListener('click', closeSearchMeals);
  
  overlayDiv.addEventListener('click', function(event) {
    if (event.target === overlayDiv) {
      closeSearchMeals();
    }
  });
  
  const style = document.createElement('style');
  style.textContent = `
    .page-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 998;
      display: none;
    }
    
    .search-food-visible {
      z-index: 999;
      position: absolute;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }
    
    .foodlogitem {
      animation: fadeIn 0.3s;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0px;
    }
    
    @media screen and (max-width: 1550px) {
      #foodlogitemname {
        font-size: 14px;
      }
      #foodlogitemservingsize {
        font-size: 12px;
      }
      .macros span {
        font-size: 11px;
      }
      #foodlogitemcaloriecount {
        font-size: 13px;
      }
      .food-item-trash i {
        font-size: 14px;
      }
    }
    
    .right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .macros {
      display: flex;
      flex-direction: column;
      font-size: 0.8rem;
      text-align: right;
    }
    
    .food-item-trash {
      cursor: pointer;
      margin-left: 10px;
    }
    
    .food-item-trash i:hover {
      color: #e74c3c;
    }
  `;
  document.head.appendChild(style);
  
  // Initialize calorie count on page load
  updateTotalCalories();
});