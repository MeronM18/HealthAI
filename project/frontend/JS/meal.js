  document.addEventListener('DOMContentLoaded', function() {
  const breakfastAddBtn = document.getElementById('breakfastaddbtn');
  const snacksAddBtn = document.getElementById('snacksaddbtn');
  const lunchaddbtn = document.getElementById('lunchaddbtn');
  const drinksaddbtn = document.getElementById('drinksaddbtn');
  const dinneraddbtn = document.getElementById('dinneraddbtn');
  const searchMealsDiv = document.getElementById('searchfood');
  const closeFoodBtn = document.getElementById('closeFoodBtn');

  breakfastAddBtn.addEventListener('click', function() {
  searchMealsDiv.style.visibility = 'visible';
  searchMealsDiv.style.opacity = '1';
  });

  closeFoodBtn.addEventListener('click', function(){
  searchMealsDiv.style.opacity = '0';
  setTimeout(function() {
  searchMealsDiv.style.visibility = 'hidden'; 
  }, 500);
  });

  snacksAddBtn.addEventListener('click', function() {
  searchMealsDiv.style.visibility = 'visible';
  searchMealsDiv.style.opacity = '1';
  });

  closeFoodBtn.addEventListener('click', function(){
  searchMealsDiv.style.opacity = '0';
  setTimeout(function() {
  searchMealsDiv.style.visibility = 'hidden'; 
  }, 500);
  });

  lunchaddbtn.addEventListener('click', function() {
  searchMealsDiv.style.visibility = 'visible';
  searchMealsDiv.style.opacity = '1';
  });

  closeFoodBtn.addEventListener('click', function(){
  searchMealsDiv.style.opacity = '0';
  setTimeout(function() {
  searchMealsDiv.style.visibility = 'hidden'; 
  }, 500);
  });

  drinksaddbtn.addEventListener('click', function() {
  searchMealsDiv.style.visibility = 'visible';
  searchMealsDiv.style.opacity = '1';
  });

  closeFoodBtn.addEventListener('click', function(){
  searchMealsDiv.style.opacity = '0';
  setTimeout(function() {
  searchMealsDiv.style.visibility = 'hidden'; 
  }, 500);
});

  dinneraddbtn.addEventListener('click', function() {
  searchMealsDiv.style.visibility = 'visible';
  searchMealsDiv.style.opacity = '1';
  });

  closeFoodBtn.addEventListener('click', function(){
  searchMealsDiv.style.opacity = '0';
  setTimeout(function() {
  searchMealsDiv.style.visibility = 'hidden'; 
  }, 500);
  });
});

  /***********************************************************************************************************/

  document.addEventListener('DOMContentLoaded', function() {
  const unitsBtn = document.getElementById('unitsbtn');
  const servingUnits = document.querySelector('.servingunits');
  const unitsLabel = document.getElementById('unitslabel');
  const unitItems = servingUnits.querySelectorAll('a');

  unitsLabel.textContent = unitItems[0].textContent;

  unitsBtn.addEventListener('click', function() {
  servingUnits.classList.toggle('show');

  if (servingUnits.classList.contains('show')) {
  unitItems.forEach(item => item.style.backgroundColor = '');
  }
});

  unitItems.forEach(function(item) {
  item.addEventListener('click', function(event) {
  event.preventDefault();

  unitsLabel.textContent = item.textContent;

  unitItems.forEach(unitItem => unitItem.style.backgroundColor = '');
  item.style.backgroundColor = 'lightblue';

  servingUnits.classList.remove('show');
  });
  });
});

  /*************************************************************************************************************/
