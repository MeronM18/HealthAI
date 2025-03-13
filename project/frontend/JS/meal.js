document.addEventListener('DOMContentLoaded', function() {
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
  
  let foodCount = 0;
  let currentContainer = null;
  
  const overlayDiv = document.createElement('div');
  overlayDiv.className = 'page-overlay';
  document.body.appendChild(overlayDiv);
  
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
        <span id="foodlogitemcaloriecount">${calories} kcal</span>
        <span class="food-item-trash"><i class='bx bxs-trash'></i></span>
      </div>
    `;
    
    logItem.dataset.calories = calories;
    
    const trashIcon = logItem.querySelector('.food-item-trash');
    trashIcon.addEventListener('click', function() {
      logItem.style.animation = 'fadeOut 0.3s';
      
      setTimeout(() => {
        container.removeChild(logItem);
      }, 300);
    });
    
    container.prepend(logItem);
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
    
    .food-item-trash {
      cursor: pointer;
      margin-left: 10px;
    }
    
    .food-item-trash i:hover {
      color: #e74c3c;
    }
  `;
  document.head.appendChild(style);
});