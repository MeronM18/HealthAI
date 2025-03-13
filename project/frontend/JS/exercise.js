document.addEventListener('DOMContentLoaded', function() {
  const addExerciseBtn = document.getElementById('addexercisebtn');
  const logContainer = document.querySelector('.exerciselog-container');
  const totalCaloriesSpan = document.getElementById('calorieburnexercisepage');
  
  const milestoneInput = document.getElementById('milestonecalorievalue');
  const milestoneButton = document.getElementById('milestonebtn');
  const progressPercentage = document.getElementById('progress-percentage');
  const progressRemainingCalories = document.getElementById('progress-remaining-calories');
  const progressBar = document.querySelector('.progress-bar');

  const chooseExerciseContainer = document.querySelector('.choose-exercise-container');
  const searchExerciseDiv = document.getElementById('searchExerciseDiv');
  const closeExerciseBtn = document.getElementById('closeExerciseBtn');

  const cardioCategory = document.getElementById('cardioCategory');
  const gymCategory = document.getElementById('gymCategory');
  const outdoorCategory = document.getElementById('outdoorCategory');
  const sportsCategory = document.getElementById('sportsCategory');

  const cardioSelection = document.getElementById('cardioSelection');
  const gymSelection = document.getElementById('gymSelection');
  const sportSelection = document.getElementById('sportSelection');
  const outdoorSelection = document.getElementById('outdoorSelection');

  const overlayDiv = document.createElement('div');
  overlayDiv.className = 'page-overlay';
  document.body.appendChild(overlayDiv);

  let exerciseCount = 0;
  let totalCalories = 0;
  let calorieGoal = 0;
  let milestoneSet = false;
  let goalAchieved = false;

  function openSearchExercise() {
    searchExerciseDiv.style.visibility = 'visible';
    searchExerciseDiv.style.opacity = '1';
    searchExerciseDiv.classList.add('search-exercise-visible');
    overlayDiv.style.display = 'block';
  }

  function closeSearchExercise() {
    searchExerciseDiv.style.visibility = 'hidden';
    searchExerciseDiv.style.opacity = '0';
    searchExerciseDiv.classList.remove('search-exercise-visible');
    overlayDiv.style.display = 'none';
  }

  function openChooseExercise() {
    chooseExerciseContainer.style.visibility = 'visible';
    chooseExerciseContainer.style.opacity = '1';
    chooseExerciseContainer.classList.add('search-exercise-visible');
    overlayDiv.style.display = 'block';
  }

  function closeChooseExercise() {
    chooseExerciseContainer.style.visibility = 'hidden';
    chooseExerciseContainer.style.opacity = '0';
    chooseExerciseContainer.classList.remove('search-exercise-visible');
    overlayDiv.style.display = 'none';
  }

  milestoneButton.addEventListener('click', function() {
    const inputValue = parseInt(milestoneInput.value);
    
    if (isNaN(inputValue) || inputValue <= 0) {
      alert('Please enter a valid number greater than 0');
      return;
    }
    
    calorieGoal = inputValue;
    milestoneSet = true;
    goalAchieved = false;
    updateProgress();
    milestoneInput.value = '';
  });
  
  addExerciseBtn.addEventListener('click', function() {
    openChooseExercise();

    if (logContainer.children.length === 0) {
      exerciseCount = 0;
    }
    
    exerciseCount++;
    
    const now = new Date();
    const dateTimeStr = now.toLocaleString();
    
    const caloriesBurned = Math.floor(Math.random() * 300) + 100;
    
    totalCalories += caloriesBurned;
    
    totalCaloriesSpan.textContent = totalCalories + " kcal";
    
    if (milestoneSet) {
      updateProgress();
    }
    
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    
    const exerciseName = `Exercise ${exerciseCount}`;
    
    logItem.innerHTML = `
      <div class="log-item-title">${exerciseName}</div>
      <div class="log-item-calories">Calories: ${caloriesBurned} kcal</div>
      <div class="log-item-time">${dateTimeStr}</div>
      <div class="log-item-trash"><i class='bx bxs-trash'></i></div>
    `;
    
    logItem.dataset.calories = caloriesBurned;
    
    const trashIcon = logItem.querySelector('.log-item-trash');
    trashIcon.addEventListener('click', function() {
      totalCalories -= parseInt(logItem.dataset.calories);
      
      totalCaloriesSpan.textContent = totalCalories + " kcal";
      
      if (milestoneSet) {
        updateProgress();
      }
      
      logItem.style.animation = 'fadeOut 0.3s';
      
      setTimeout(() => {
        logContainer.removeChild(logItem);
      }, 300);
    });
    
    logContainer.prepend(logItem);
  });

  cardioCategory.addEventListener('click', function(){
    closeChooseExercise();
    openSearchExercise();
  });

  gymCategory.addEventListener('click', function(){
    closeChooseExercise();
    openSearchExercise();
  });

  outdoorCategory.addEventListener('click', function(){
    closeChooseExercise();
    openSearchExercise();
  });

  sportsCategory.addEventListener('click', function(){
    closeChooseExercise();
    openSearchExercise();
  });

  overlayDiv.addEventListener('click', function(event) {
    if (event.target === overlayDiv) {
      closeSearchExercise();
      closeChooseExercise();
    }
  });

  if (closeExerciseBtn) {
    closeExerciseBtn.addEventListener('click', function() {
      closeSearchExercise();
    });
  }

  function setActiveSelection(selectionElement) {
    cardioSelection.classList.remove('active');
    gymSelection.classList.remove('active');
    sportSelection.classList.remove('active');
    outdoorSelection.classList.remove('active');
    
    selectionElement.classList.add('active');
  }
  
  cardioCategory.addEventListener('click', function() {
    setActiveSelection(cardioSelection);
    closeChooseExercise();
    openSearchExercise();
  });
  
  gymCategory.addEventListener('click', function() {
    setActiveSelection(gymSelection);
    closeChooseExercise();
    openSearchExercise();
  });
  
  sportsCategory.addEventListener('click', function() {
    setActiveSelection(outdoorSelection);
    closeChooseExercise();
    openSearchExercise();
  });
  
  outdoorCategory.addEventListener('click', function() {
    setActiveSelection(sportSelection);
    closeChooseExercise();
    openSearchExercise();
  });
  
  function updateProgress() {
    const remainingCalories = calorieGoal - totalCalories;
    
    const percentage = calorieGoal > 0 ? Math.min(100, (totalCalories / calorieGoal) * 100) : 0;
    
    progressRemainingCalories.textContent = `${remainingCalories} kcal`;
    progressPercentage.textContent = `${percentage.toFixed(0)}%`;
    
    progressBar.style.width = `${percentage}%`;
    
    if (percentage <= 25) {
      progressBar.style.backgroundColor = '#ff0000';
    } else if (percentage > 25 && percentage <= 50) {
      progressBar.style.backgroundColor = '#f7a20d';
    } else if (percentage > 50 && percentage <= 75) {
      progressBar.style.backgroundColor = '#3498db';
    } else if (percentage > 75 && percentage < 100) {
      progressBar.style.backgroundColor = '#2cdf00'; 
    } else if (percentage >= 100) {
      progressBar.style.backgroundColor = '#2cdf00'; 
      
      if (!goalAchieved) {
        createConfetti();
        goalAchieved = true;
      }
    }
  }
  
  function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      const colors = ['#ffd700', '#ff0000', '#3498db', '#2ecc71', '#f7a20d', '#9b59b6'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.backgroundColor = color;
      
      const left = Math.random() * 100;
      confetti.style.left = `${left}vw`;
      
      const size = Math.random() * 8 + 6;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      const rotation = Math.random() * 360;
      confetti.style.transform = `rotate(${rotation}deg)`;
      
      const duration = Math.random() * 1 + 2;
      confetti.style.animationDuration = `${duration}s`;
      
      const delay = Math.random() * 2;
      confetti.style.animationDelay = `${delay}s`;
      
      confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 5000);
  }
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }
    
    @keyframes confettiFall {
      0% {
        transform-origin: center;
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform-origin: center;
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
    
    .log-item {
      animation: fadeIn 0.1s;
    }
    
    .log-item-trash {
      cursor: pointer;
    }
    
    .log-item-trash i:hover {
      color: #e74c3c;
    }
    
    .confetti-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    }
    
    .confetti {
      position: absolute;
      top: -15px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: confettiFall linear forwards;
    }

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
    
    .search-exercise-visible {
      z-index: 999;
      position: absolute;
    }
       
    .choose-exercise-container {
    width: 100%;
    height: 100%;
  }
    #searchExerciseDiv {
      width: 70%;
      height: 93%;
    }
  `;
  document.head.appendChild(style);
});

/******************************************************************************* */

document.addEventListener('DOMContentLoaded', function() {
  const categories = document.querySelectorAll('.currentselection h2');
  
  categories.forEach(category => {
    category.addEventListener('click', function() {
      if (!this.classList.contains('active')) {
        categories.forEach(cat => {
          cat.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });
});

/******************************************************************************* */
