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

/************************************************************************************************************************* */

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

/************************************************************************************************************************* */
document.getElementById('logsleep').addEventListener('click', function() { //grab the button that logs sleep data
  let hours = parseInt(document.getElementById('sleephours').value) || 0; //gets the value from the hours input box and takes the string and converts it into an integer
  let minutes = parseInt(document.getElementById('sleepminutes').value) || 0; //gets the value from the minutes input box and takes the string and converts it into an integer
  let alertMessage = document.querySelector('.entersleepvalue'); //grabs the alert message 

  //show alert if no values are entered
  if (hours <= 0 && minutes <= 0) {
      alertMessage.classList.add('show'); //toggle the message class that displays text
      return;
  }

  //hide alert if values are entered
  alertMessage.classList.remove('show');

  //convert minutes to hours if 60 or more
  if (minutes >= 60) {
      hours += Math.floor(minutes / 60); //hours calculation after minutes are converted
      minutes = minutes % 60; //remaining minutes are calculated as the remainder from above calculation
  }

  //ensure hours do not exceed 24
  if (hours > 24) {
      alertMessage.textContent = "Max is 24 hours.";
      alertMessage.classList.add('show'); //display alert message
      return;
  }

  const date = new Date().toLocaleDateString(); //grab the current date
  const totalMinutes = hours * 60 + minutes; //calculate total minutes of sleep

  appendLog(`Slept for: ${hours} hours and ${minutes} minutes`, date, totalMinutes); //this is the display text of when a log is added that shows how long slept for, date

  //clear input fields
  document.getElementById('sleephours').value = ''; //once logged data, the input fields go back to empty
  document.getElementById('sleepminutes').value = '';
});

function resetSleep() { //function that clears all log data when button is clicked 
  const resetButton = document.getElementById('deletelog'); //grab the button
  resetButton.addEventListener('click', function() { //when clicked, clear up all input values 
      document.getElementById('sleephours').value = '';
      document.getElementById('sleepminutes').value = '';
      document.getElementById('sleeplogdata').innerHTML = ''; //set the log HTML element to empty 
      document.getElementById('sleeplogdata').classList.remove('visible'); //toggle the css class that hides the log bar
  });
}

function appendLog(message, date, totalMinutes) { //function that creates the div elements to store the sleep info
  const log = document.getElementById('sleeplogdata'); //grabs the section that will hold the data
  const logItem = document.createElement('div'); //create item div for each log
  
  let sleepClass = 'log-item'; //selects the css styling for the info logged

    if (totalMinutes < 360) { //if statements that check the amount of sleep user inputted and judging based on scale on whether they had enough sleep
        sleepClass += ' notenough-sleep'; //calls the css styling if sleep is less than 6 hours 
    } else if (totalMinutes >= 360 && totalMinutes < 541) {
        sleepClass += ' healthy-sleep';
    } else if (totalMinutes >= 541) {
        sleepClass += ' over-sleep';
    }

logItem.className = sleepClass; //than the div is using the styles from the sleepClass

  logItem.innerHTML = `${message} <span style="font-size: 12px; color: black; font-style: italic;"> (${date})</span><i class='bx bxs-trash trash-icon' onClick="deleteLog(this)"></i>`; //now this styles the message of each log and adds the message, date, and a trash icon to remove that specific log
  log.appendChild(logItem); //adds the new log data inside the container 

  if (log.children.length > 0) { //if the number of inputted sleep logs is more than 0, than toggle css styling to show visible 
      log.classList.add('visible'); 
  }
}

function deleteLog(element) { //when the trash icon is clicked next to each sleep log and takes element as parameter to delect that specific logItem
  const logItem = element.parentElement; //refers to the entire line entry containing the message, date, and icon
  const log = document.getElementById('sleeplogdata'); //this grabs the log container where are the info is stored 

  logItem.remove(); //removes the entry 

  if (log.children.length === 0) {
      log.classList.remove('visible'); //hides the log if the number of entries is 0
  }
}

document.addEventListener("DOMContentLoaded", function() { //dom to ensure all components of the page are loaded to run
  resetSleep();
});

/***************************************************************************** */

document.querySelector('.moon').addEventListener('mouseenter', function() { //grabs the moon icon and checks when the mouse is over it 
  document.querySelector('.sleeptable').style.visibility = 'visible'; //grabs the table for the sleep status and display it when hovered over 
  document.querySelector('.sleeptable').style.opacity = '1'; //also set the table to opacity 1
});

document.querySelector('.moon').addEventListener('mouseleave', function() { //when the mouse is removed from the moon icon
  document.querySelector('.sleeptable').style.visibility = 'hidden'; //hide the table
  document.querySelector('.sleeptable').style.opacity = '0'; //opacity to 0 to hide
});

document.querySelector('.sleeptable').addEventListener('mouseenter', function() { 
  document.querySelector('.sleeptable').style.visibility = 'visible'; 
  document.querySelector('.sleeptable').style.opacity = '1'; 
});

document.querySelector('.sleeptable').addEventListener('mouseleave', function() { 
  document.querySelector('.sleeptable').style.visibility = 'hidden'; 
  document.querySelector('.sleeptable').style.opacity = '0'; 
});

/******************************************************************************** */
document.addEventListener("DOMContentLoaded", function() {
  const weightInput = document.getElementById('weight-progress-entry'); //grab the element that will have input value of weight

  weightInput.addEventListener('input', function() { //checks for the event of user keyboard input
    let inputValue = weightInput.value.replace(' lbs', ''); //sets a variable equal to the input value and replacing that with ' lbs'
    
    if (inputValue) { //checks if the user input value contains 'lbs' or not
      weightInput.value = inputValue + ' lbs';
    } else {
      weightInput.value = '';
    }
  });

  weightInput.addEventListener('keydown', function(event) { //event listener for when the delete button is pressed
    if (event.key === 'Backspace') {
      if (weightInput.value.endsWith(' lbs')) { //checks if input has a number value and lbs unit at end
        weightInput.value = weightInput.value.replace(' lbs', ''); //then when delete it clicked, the number will be deleted
      }
    }
  });
});

/************************************************************************************** */
const addEntryButton = document.getElementById('addentrybutton'); 
addEntryButton.addEventListener("click", function() { 
  const entryForm = document.querySelector('.entryinput');  
  const alertMessage = document.querySelector('.galleryalertmessage');

  entryForm.classList.toggle('show'); 
  alertMessage.classList.remove('show'); 

  if (entryForm.classList.contains('show')) {
    addEntryButton.innerHTML = "<i class='bx bx-minus'></i>"; 
  } else {
    addEntryButton.innerHTML = "<i class='bx bx-plus-medical'></i>";
  }
});

const postEntryButton = document.getElementById('post-entry'); 
postEntryButton.addEventListener("click", function() {
  let weight = parseInt(document.getElementById('weight-progress-entry').value) || 0; 
  let date = document.getElementById('date-entry'); 
  const selectedDate = date.value; 
  const alertMessage = document.querySelector('.galleryalertmessage'); 
  const entryForm = document.querySelector('.entryinput'); 


  if (weight <= 0 && !selectedDate) { 
    alertMessage.classList.add('show'); 
    alertMessage.innerHTML = "Please fill in missing fields!";
  } 
  else if (weight <= 0) { 
    alertMessage.classList.add('show');  
    alertMessage.innerHTML = "Please enter a valid weight!";
  } 
  else if (!selectedDate) {
    alertMessage.classList.add('show');  
    alertMessage.innerHTML = "Please select a date!";
  } 
  else {
    const currentDate = new Date(); 
    const inputDate = new Date(selectedDate);

    if (inputDate > currentDate) { 
      alertMessage.classList.add('show'); 
      alertMessage.innerHTML = "The selected date cannot be in the future!";
    } else { 
      alertMessage.classList.add('show');
      alertMessage.innerHTML = "Entry Added!";

      entryForm.classList.remove('show');
      addEntryButton.innerHTML = "<i class='bx bx-plus-medical'></i>";

      document.getElementById('weight-progress-entry').value = '';
      document.getElementById('date-entry').value = '';

      setTimeout(function() {
        alertMessage.classList.remove('show');
      }, 2000);

      appendProgressLog(weight, selectedDate);
    }
  }
});

function appendProgressLog(weight, date) {
  if (weight > 0 && date) { 
    const progressLog = document.getElementById('progresslogdata');
    const progressLogItem = document.createElement('div');

    progressLogItem.className = 'progresslog-item';

    progressLogItem.innerHTML = `${weight} lbs <span style="font-size: 14px; color: black; font-style: italic; color: #757575;">(${date})</span><i class='bx bxs-trash trash-icon' onClick="deleteProgressLog(this)"></i>`;
    
    progressLog.appendChild(progressLogItem);

    if (progressLog.children.length > 0) {
      progressLog.classList.add('visible');
    }
  }
}

function deleteProgressLog(element) {
  const logItem = element.parentElement; 
  const progressLog = document.getElementById('progresslogdata');

  logItem.remove();

  if (progressLog.children.length === 0) {
    progressLog.classList.remove('visible');
  }
}

document.addEventListener("DOMContentLoaded", function() {
});


/************************************************************************************ */
document.addEventListener("DOMContentLoaded", function() { //load the DOM; basically functions the gallery buttons to show when one is active or not
  const onepicBtn = document.getElementById('onepicbtn'); //grab both gallery buttons 
  const twopicBtn = document.getElementById('twopicbtn');
  let onepicClicked = true; //set first button clicked as true to start off as white 
  let twopicClicked = false; //set second button clicked as false to not having white styling 

  const setIconWhite = (btn, iconClass) => { //function to always the first square icon start with white 
    const icon = btn.querySelector(iconClass);
    icon.style.color = 'white';
  };

  const resetIconColor = (btn, iconClass) => { //removes the white icon when another selected 
    const icon = btn.querySelector(iconClass);
    icon.style.color = '';
  };

  setIconWhite(onepicBtn, '.squareicon'); //sets the first button icon to white 

  onepicBtn.addEventListener('mouseenter', function() { //function to check when mouse is hovering over the first button
    if (!onepicClicked) { //when button is not clicked
      const icon1 = onepicBtn.querySelector('.squareicon'); //originally start off the button as white even when not hovered over  
      icon1.style.color = 'white';
    }
  });

  onepicBtn.addEventListener('mouseleave', function() { //function that removes the styling when the mouse is no longer hovering over first button
    if (!onepicClicked) {
      const icon1 = onepicBtn.querySelector('.squareicon');
      icon1.style.color = '';
    }
  });

  twopicBtn.addEventListener('mouseenter', function() { //second button functionality for mouse hover 
    if (!twopicClicked) {
      const icon2 = twopicBtn.querySelector('.twosquareicon');
      icon2.style.color = 'white';
    }
  });

  twopicBtn.addEventListener('mouseleave', function() {
    if (!twopicClicked) {
      const icon2 = twopicBtn.querySelector('.twosquareicon');
      icon2.style.color = '';
    }
  });

  onepicBtn.addEventListener('click', function() { //when the first button is clicked function 
    if (!onepicClicked) { //if not clicked and originally as white, then it will set the clicked variable as true to show it is highlighted 
      setIconWhite(onepicBtn, '.squareicon');
      onepicClicked = true;
      if (twopicClicked) { //however, if the second button is not clicked, then it will remove the white styling
        resetIconColor(twopicBtn, '.twosquareicon');
        twopicClicked = false;
      }
    }
  });

  twopicBtn.addEventListener('click', function() { //same functionality for the second butotn 
    if (!twopicClicked) {
      setIconWhite(twopicBtn, '.twosquareicon');
      twopicClicked = true;
      if (onepicClicked) {
        resetIconColor(onepicBtn, '.squareicon');
        onepicClicked = false;
      }
    }
  });
});

/************************************************************************************************************************************** */

document.addEventListener("DOMContentLoaded", function() {
  const onepicBtn = document.getElementById('onepicbtn'); //grabs both gallery buttons 
  const twopicBtn = document.getElementById('twopicbtn');
  const gallery = document.querySelector('.gallery'); //grabs the container of the gallery picture

  let isTwopicClicked = false; //sets the sidebyside gallery option to false to initally begin with only one pic

  onepicBtn.addEventListener('click', function() { //when one pic button is clicked 
    const galleries = document.querySelectorAll('.gallery'); //grabs the gallery container 
    if (galleries.length > 1) { //if more than one galleries 
      galleries[1].remove(); //removes second gallery and makes sure only one gallery can be added 
    }
    isTwopicClicked = false; //sets back to false so you can rotate between gallery views 
  });

  twopicBtn.addEventListener('click', function() { //when two pic button is clicked 
    if (!isTwopicClicked) { //when it is clicked 
      const newGallery = gallery.cloneNode(true); //will clone the gallery div and make a new one
      gallery.parentElement.appendChild(newGallery); //adds it to the page 
      isTwopicClicked = true; //then sets that button to true so both views are shown 
    }
  });
});



/**************************************************************************************************************************************** */

