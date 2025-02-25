function changeForm() { //create a function to change between login form and register form
  var get = document.querySelector(".login-formbox"); //these 4 lines create variables that store the needed info from the HTMl
  var get1 = document.querySelector(".register-formbox"); //this grabs the register form container
  const registerButton = document.getElementById('register'); //this grabs the register button
  const message = document.getElementById('message'); //this grabs the message button

  get.classList.toggle("hide"); //from the forms, this will perform a class in the css that hides and shows the forms
  get1.classList.toggle("visible");

  if (registerButton.innerText === 'Register') { //checks if currently on login page or register page 
    message.innerText = 'Already have an account?';  //if on register formbox, the login nav will show on the left
    registerButton.innerText = 'Login';             
  } else { //vice versa
    message.innerText = 'Don\'t have an account?';  
    registerButton.innerText = 'Register';         
}
}

/********************************************************* */

document.addEventListener("DOMContentLoaded", function () { //the DOMcontentloaded function is used read and modify contents and structure of a webpage
  let lockiconLogin = document.getElementById('lockicon-login'); //select the lockicon from the login formbox
  let passwordLogin = document.getElementById('password-login'); //select the password input box from the login formbox
  
  lockiconLogin.onclick = function() { //when the icon is clicked, the function is performed
    if(passwordLogin.type === 'password'){ //checks if the current input inside the password inputbox is that of type 'password'
      passwordLogin.type = 'text'; //if so the password is revealed and not hidden
    } else { //this keeps the password hidden
      passwordLogin.type = 'password';
    }
  }
  
  let lockiconRegister = document.getElementById('lockicon-register'); //same process now on the register formbox
  let passwordRegister = document.getElementById('password-register');  
  
  lockiconRegister.onclick = function() {
    if(passwordRegister.type === 'password'){
      passwordRegister.type = 'text';
    } else {
      passwordRegister.type = 'password';
    }
  }
});  

/********************************************************* */

document.addEventListener("DOMContentLoaded", function () { //function to redirect to new page once login button is clicked
  const loginButton = document.getElementById('login-btn'); //grabs the login button from the login formbox
  
  if (loginButton) { //this checks if the login-btn id is actually true and exists in the DOM
    loginButton.addEventListener("click", openPage); //call the function openpage when clicked
  }
  
  function openPage(event) {
    event.preventDefault(); //prevents the page from refreshing
    window.location.href = "/frontend/HTML/index.html"; //opens the index.html page
  }
});

/********************************************************* */

document.addEventListener("DOMContentLoaded", function() { //this functions checks what html page is currently loaded
  const currentPage = window.location.pathname; //grabs the name of the current window
  const menuItems = document.querySelectorAll('.menu-items'); //this selects all menu items from the navbar on the left side of page

  menuItems.forEach(function(item){ //for all menuitems, this function is performed
    const link = item.getAttribute('href'); //grabs the link of what the menu items are referring to
    if (link == currentPage) { //checks if the link of each menu item is that of the current html page
      item.classList.add('active'); //if it is, this will call the css class to highlight the current page menu item
    }
  })
})

/********************************************************* */

const toggleButton = document.getElementById('toggle-btn'); //this grabs the button that opens the side menu and displays it
toggleButton.addEventListener("click", openSideBar); //once clicked, the function is performed 

function openSideBar() {
  const navbar = document.querySelector('nav'); //selects the nav container
  const dashboard = document.querySelector('main'); //also selects the main dashboard container

  navbar.classList.toggle('show'); //calls the show class to actually display the navbar
  dashboard.classList.toggle('after'); //this adjusts the layout of the main to fit the navbar in
}

/********************************************************* */

const closeButton = document.getElementById('close-btn'); //this is to close the navbar
closeButton.addEventListener("click", closeSideBar); //function once closed button is clicked 

function closeSideBar(){
  const navbarshow = document.querySelector('nav'); //grabs the nav container
  navbarshow.classList.remove('show'); //calls the shows class and removes any styles from it which removes the navbar and keeps it hidden

  const dashboardclose = document.querySelector('main'); //this grabs the main dashboard container again
  dashboardclose.classList.remove('after'); //removes any styles that were added and now back to current position
}

/********************************************************* */

const submenuButton = document.getElementById('submenu-btn'); //top right of header to open dropdown menu
submenuButton.addEventListener("click", toggleSideMenu); //function when the button is clicked 

function toggleSideMenu() {
  const submenu = document.querySelector('.sub-menu'); //grabs the class of the HTML elements 
  submenu.classList.toggle('show'); //calls the class to actually display the submenu

  submenuButton.classList.toggle('downarrow-icon'); //changes the downarrow icon into an arrow facing up
}

/*********************************************************** */

const weeklyGoalButton = document.getElementById('weeklygoalbtn');  //creates variable to grab the weeklygoal selection dropdownmenu
weeklyGoalButton.addEventListener("click", toggleWeeklyGoal); //once clicked a function is performed 

function toggleWeeklyGoal() { //create and store items into 4 variables
  const weeklyGoalList = document.querySelector('.wklygoallist'); //this is the list containing the dropdown menu options
  const weeklygoalLabel = document.getElementById('weeklygoalLabel'); //grab the label for what goal is selected
  const goalItems = weeklyGoalList.querySelectorAll('a'); //grabs all anchor tags from the list
  const arrowIcon = weeklyGoalButton.querySelector('i'); //grabs the icon for the dropdown menu

  weeklyGoalList.classList.toggle('show'); //this shows the drop down menu when clicked by calling the class
  
  if (weeklyGoalList.classList.contains('show')) { //if the list is shown, then the icon will be transformed and rotated 180 degrees
    arrowIcon.style.transform = 'rotate(180deg)';
  } else { //if not shown, icon stays same
    arrowIcon.style.transform = 'rotate(0deg)';
  }

  goalItems.forEach(item => { //function to check what menu option is selected
    item.addEventListener('click', (e) => { //variable item that also checks when an option is clicked
      e.preventDefault(); //prevents from refreshing page

      
      weeklygoalLabel.textContent = item.textContent; //the item that is selected will then be displayed inside the label

      
      weeklyGoalList.classList.remove('show'); //this will then remove the original show class and now the dropdownmenu is hidden

      
      arrowIcon.style.transform = 'rotate(0deg)'; //this will now rotate the icon back to its original position
    });
  });
}

/************************************************************************* */

const activityButton = document.getElementById('activitybtn'); //similar function to the one above for dropdownmenus and setting the label text 
activityButton.addEventListener("click", toggleActivities);

function toggleActivities() {
  const activityOptions = document.querySelector('.activitymenu');
  const activityLabel = document.getElementById('activityLabel');
  const activityItems = activityOptions.querySelectorAll('a');
  const arrowIcon = activityButton.querySelector('i'); 

  activityOptions.classList.toggle('show');
  
  if (activityOptions.classList.contains('show')) {
    arrowIcon.style.transform = 'rotate(180deg)';
  } else {
    arrowIcon.style.transform = 'rotate(0deg)';
  }

  activityItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      activityLabel.textContent = item.textContent;

      activityOptions.classList.remove('show');

      arrowIcon.style.transform = 'rotate(0deg)';
    });
  });
}

/*************************************************************** */

const menudropdownIcons = document.querySelectorAll('.weeklygoalbtn, .activitybtn'); //select the icons on the menus

menudropdownIcons.forEach(button => { //for each icon, this function is performed once clicked
  button.addEventListener("click", () => {
    button.classList.toggle('clicked'); //calls the class assigned to the button and this performs a smooth transition when icons are rotated 
  });
});

/************************************************************************* */

//function for the calorie count incrementer
let calorieGoalCount = 0; //originally set calorie count to 0
let intervalId = null; //no interval at the start hence at null

function updateInputValue() { //function to update value
  document.getElementById('caloriecountvalue').value = calorieGoalCount; //grab the input value that holds the calorie count and set its value to 0
}

document.getElementById('minusbtn').onclick = function() { //get the minus button and perform function when clicked
  // Decrease by 50, but ensure it doesn't go below 0
  calorieGoalCount = Math.max(0, calorieGoalCount - 50); //when the minus button is clicked, the current value will be decremented by 50
  updateInputValue(); //this updates the value inside the input automatically
}

document.getElementById('addbtn').onclick = function() { //get the add button and perform function when clicked 
  calorieGoalCount += 50; //when add btn is clicked, the current value will be incremented by 50
  updateInputValue(); //again update value 
}

document.getElementById('caloriecountvalue').addEventListener('input', function() { //grab the input value box that holds the calorie count and add an eventlistener for when user enters a value and perform a function
  const enteredValue = parseInt(this.value); //variable that stores in the entered value from the user and change that value into an integer
  if (!isNaN(enteredValue) && enteredValue >= 0) { //checks if value entered is valid and not a negative
    calorieGoalCount = enteredValue; //this will then set the entered value to the new calorie count
  } else { //if negative or invalid number is entered, this will keep calorie count as 0
    calorieGoalCount = 0;
  }
  updateInputValue(); //update the value 
});

document.getElementById('minusbtn').addEventListener('mousedown', function() { //this function listens to the mouse and checks when user is holding it down for the minus button
  intervalId = setInterval(function() { //this will now change the value of the interval from null to the function
    calorieGoalCount = Math.max(0, calorieGoalCount - 50); //when minus button is held down the value continues to decrease by 50
    updateInputValue(); //value gets updated
  }, 100); //and every 300 milliseconds that mouse is held down, the value changes 
});

document.getElementById('addbtn').addEventListener('mousedown', function() { //this functions performs the same thing as mouse being held down for the add button
  intervalId = setInterval(function() {
    calorieGoalCount += 50; //increase value by 50
    updateInputValue(); //update value realtime
  }, 100); //and every 300 milliseconds that mouse is held down, the value changes 
});

document.addEventListener('mouseup', function() { //checks when the user release their finger from the mouse
  clearInterval(intervalId); //the interval's value is now cleared and stops the automatic increment/decrement
});

document.getElementById('minusbtn').addEventListener('mouseleave', function() { //checks when the mouse is released from the minus button
  clearInterval(intervalId); //clears interval
});

document.getElementById('addbtn').addEventListener('mouseleave', function() { //checks when the mouse is released from the add button
  clearInterval(intervalId); //clears interval 
});

document.addEventListener('contextmenu', function(){ //checks if right click is clicked to prevent from continuous increment/decrement
  clearInterval(intervalId); //clears interval
});

/************************************************************************* */

function resetForm(){ //function to reset the health info form
  const resetButton = document.getElementById('resetbtn'); //create a variable that stores the reset button
  resetButton.addEventListener("click", function(){ //once clicked, function is performed
    document.getElementById('age').value = ''; //all values/inputs in the form are set back to empty
    document.getElementById('height').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('radio1').checked = false;
    document.getElementById('radio2').checked = false;
    document.getElementById('goalweight').value = '';
    document.getElementById('weeklygoalLabel').textContent = '';
    document.getElementById('activityLabel').textContent = '';
    document.getElementById('caloriecountvalue').value = '0';
  });
}

document.addEventListener("DOMContentLoaded", function() { //this runs the function to reset form as long as all elements of HTML page are loaded
  resetForm();
});

/************************************************************************************ */

let box = document.querySelector('.box'); //grab the box element containing all the items for the scroll wheel

for (let i = 14; i <= 40.1; i += 0.1) { //from range 14.0 to 40.1 this for loop runs
  let div = document.createElement('div'); //this creates a div element through each other iteration
  div.className = 'item'; //classname for each div is set to item so they can all be styled
  div.textContent = i.toFixed(1); //rounds the current value of i to 1 decimal so no miscalculations in the loop

  let roundedValue = parseFloat(i.toFixed(1)); //rounds the value to 1 decimal place

  if (roundedValue >= 14 && roundedValue <= 18.4) { //now this applies styling for each div items from ranges of bmi
    div.style.backgroundColor = 'rgb(125, 243, 247)';
  }

  if (roundedValue >= 18.5 && roundedValue <= 24.9) {
    div.style.backgroundColor = 'rgb(240, 253, 164)';
  }

  if (roundedValue >= 25 && roundedValue <= 29.9) {
    div.style.backgroundColor = 'rgb(117, 252, 128)';
  }

  if (roundedValue >= 30 && roundedValue <= 34.9) {
    div.style.backgroundColor = 'rgb(247, 201, 76)';
  }

  if (roundedValue >= 35 && roundedValue <= 40) {
    div.style.backgroundColor = 'rgb(250, 92, 92)';
  }

  box.appendChild(div); //this adds the newly created div to the box element
}

function moveNext() { //function to scroll next between div items
  let items = document.querySelectorAll('.item'); //grab the divs by their class
  box.appendChild(items[0]);  //this moves the first item to end of box
}

function movePrev() { //function to scroll back between div items
  let items = document.querySelectorAll('.item'); //grabs the divs by their class
  box.prepend(items[items.length - 1]); //moves the last item to the beginning of the box
}

window.addEventListener('wheel', function (event) { //this functions performs when the scroll wheel on the user's mouse is used
  const scrollSpeed = 4; //how fast the box div items move when scrolled
  
  if (event.deltaY > 0) {  //if scroll is downward, then the items get moved to the next position
    for (let i = 0; i < scrollSpeed; i++) {
      moveNext(); 
    }
  } else { //if scroll is upward, the items get moved to previous position
    for (let i = 0; i < scrollSpeed; i++) {
      movePrev(); 
    }
  }
});

