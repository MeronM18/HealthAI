const createDropdownHandler = (buttonId, listClass, labelId) => {
  const button = document.getElementById(buttonId);
  const list = document.querySelector(listClass);
  const label = document.getElementById(labelId);
  const arrowIcon = button.querySelector('i');

  button.addEventListener('click', () => {
    list.classList.toggle('show');
    arrowIcon.style.transform = list.classList.contains('show') 
      ? 'rotate(180deg)' 
      : 'rotate(0deg)';
  });

  const items = list.querySelectorAll('a');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      label.textContent = item.textContent;
      list.classList.remove('show');
      arrowIcon.style.transform = 'rotate(0deg)';
    });
  });
};

//Apply to both weekly goal and activity dropdowns
createDropdownHandler('weeklygoalbtn', '.wklygoallist', 'weeklygoalLabel');
createDropdownHandler('activitybtn', '.activitymenu', 'activityLabel');

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
    div.style.backgroundColor = 'rgb(117, 252, 128)';
  }
  
  if (roundedValue >= 25 && roundedValue <= 29.9) {
    div.style.backgroundColor = 'rgb(240, 253, 164)';
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

/*
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
*/

//Disable user scrolling on the BMI container
document.addEventListener("DOMContentLoaded", function() {
  const bmiBox = document.querySelector('.box');
  
  if (bmiBox) {
    //Prevent scroll events on the BMI box
    bmiBox.addEventListener('wheel', function(event) {
      event.preventDefault();
    });
    
    //Prevent manual scrolling with touch events
    bmiBox.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, { passive: false });
    
    //Also prevent scrolling with keyboard
    bmiBox.addEventListener('keydown', function(event) {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
      }
    });
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

  //Add the log to display
  appendLog(`Slept for: ${hours} hours and ${minutes} minutes`, date, totalMinutes); //this is the display text of when a log is added that shows how long slept for, date
  
  //Save to localStorage for persistence
  saveSleepLog(hours, minutes, date, totalMinutes);

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
      
      //Also clear from localStorage
      clearSleepLogs();
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
  
  //Insert at the beginning of the log (newest first) instead of appending at the end
  if (log.firstChild) {
    log.insertBefore(logItem, log.firstChild);
  } else {
    log.appendChild(logItem);
  }

  if (log.children.length > 0) { //if the number of inputted sleep logs is more than 0, than toggle css styling to show visible 
      log.classList.add('visible'); 
  }
}

function deleteLog(element) { //when the trash icon is clicked next to each sleep log and takes element as parameter to delect that specific logItem
  const logItem = element.parentElement; //refers to the entire line entry containing the message, date, and icon
  const log = document.getElementById('sleeplogdata'); //this grabs the log container where are the info is stored 

  //Get the log message to identify in localStorage
  const logText = logItem.textContent.trim();
  
  //Remove from UI
  logItem.remove(); //removes the entry 

  if (log.children.length === 0) {
      log.classList.remove('visible'); //hides the log if the number of entries is 0
  }
  
  //Remove from localStorage
  removeSleepLogByText(logText);
}

//Function to save sleep log to localStorage
function saveSleepLog(hours, minutes, date, totalMinutes) {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot save sleep log - no user ID found');
    return;
  }
  
  //Format for today's date in YYYY-MM-DD format for consistent date checking
  const today = new Date().toISOString().split('T')[0];
  
  //Create a key specific to this user and this day
  const sleepLogsKey = `healthai_sleepLogs_${userId}_${today}`;
  
  //Get existing logs or initialize new array
  const existingLogs = JSON.parse(localStorage.getItem(sleepLogsKey) || '[]');
  
  //Add new log
  existingLogs.push({
    hours,
    minutes,
    date,
    totalMinutes,
    text: `Slept for: ${hours} hours and ${minutes} minutes`
  });
  
  //Save back to localStorage
  localStorage.setItem(sleepLogsKey, JSON.stringify(existingLogs));
  console.log(`Sleep log saved for user ${userId} on ${today}`);
}

//Function to remove a specific sleep log from localStorage
function removeSleepLogByText(logText) {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot remove sleep log - no user ID found');
    return;
  }
  
  //Format for today's date
  const today = new Date().toISOString().split('T')[0];
  
  //Create a key specific to this user and this day
  const sleepLogsKey = `healthai_sleepLogs_${userId}_${today}`;
  
  //Get existing logs
  const existingLogs = JSON.parse(localStorage.getItem(sleepLogsKey) || '[]');
  
  //Filter out the log that matches the text
  const updatedLogs = existingLogs.filter(log => 
    !logText.includes(log.text)
  );
  
  //Save back to localStorage
  localStorage.setItem(sleepLogsKey, JSON.stringify(updatedLogs));
  console.log(`Sleep log removed for user ${userId}`);
}

//Function to clear all sleep logs for today
function clearSleepLogs() {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot clear sleep logs - no user ID found');
    return;
  }
  
  //Format for today's date
  const today = new Date().toISOString().split('T')[0];
  
  //Create a key specific to this user and this day
  const sleepLogsKey = `healthai_sleepLogs_${userId}_${today}`;
  
  //Clear logs for today
  localStorage.removeItem(sleepLogsKey);
  console.log(`All sleep logs cleared for user ${userId} on ${today}`);
}

//Function to load sleep logs when page loads
function loadSleepLogs() {
  //Get the user's unique ID
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot load sleep logs - no user ID found');
    return;
  }
  
  //Format for today's date
  const today = new Date().toISOString().split('T')[0];
  
  //Check for any old logs from previous days and clear them
  checkAndClearOldLogs(userId);
  
  //Create a key specific to this user and this day
  const sleepLogsKey = `healthai_sleepLogs_${userId}_${today}`;
  
  //Get today's logs
  const todayLogs = JSON.parse(localStorage.getItem(sleepLogsKey) || '[]');
  
  //Display logs in UI
  if (todayLogs.length > 0) {
    console.log(`Loading ${todayLogs.length} sleep logs for user ${userId}`);
    todayLogs.forEach(log => {
      appendLog(log.text, log.date, log.totalMinutes);
    });
  }
}

//Function to check for old logs and clear them
function checkAndClearOldLogs(userId) {
  //Get all keys in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    //Check if this is a sleep log key for this user
    if (key && key.startsWith(`healthai_sleepLogs_${userId}_`)) {
      //Extract the date from the key
      const logDate = key.split('_')[3];
      const today = new Date().toISOString().split('T')[0];
      
      //If the log is not from today, clear it
      if (logDate !== today) {
        localStorage.removeItem(key);
        console.log(`Cleared old sleep logs from ${logDate} for user ${userId}`);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function() { //dom to ensure all components of the page are loaded to run
  resetSleep();
  loadSleepLogs(); //Load existing sleep logs when page loads
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

//Variable to store selected image data
let selectedImageData = null;

//Handle image file input
const fileInput = document.getElementById('file-input');
if (fileInput) {
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file) {
      console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      //Check if the file is an image
      if (!file.type.match('image.*')) {
        alert('Please select an image file (PNG, JPG, or JPEG)');
        fileInput.value = '';
        selectedImageData = null;
        return;
      }
      
      //Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size exceeds 5MB. Please choose a smaller image.');
        fileInput.value = '';
        selectedImageData = null;
        return;
      }
      
      //Convert the image to base64
      const reader = new FileReader();
      reader.onload = function(event) {
        selectedImageData = event.target.result;
        console.log('Image loaded and converted to base64');
        
        //Don't show preview until post button is clicked
        //We'll show the image in the gallery when the post button is clicked
      };
      
      reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('Error reading the image file. Please try again.');
        selectedImageData = null;
      };
      
      reader.readAsDataURL(file);
    }
  });
}

const postEntryButton = document.getElementById('post-entry'); 
postEntryButton.addEventListener("click", function() {
  //Extract the numeric weight value (remove "lbs" if present)
  let weightInput = document.getElementById('weight-progress-entry').value;
  let weight = parseFloat(weightInput.replace(' lbs', '')) || 0; 
  
  let date = document.getElementById('date-entry'); 
  const selectedDate = date.value; 
  const alertMessage = document.querySelector('.galleryalertmessage'); 
  const entryForm = document.querySelector('.entryinput'); 

  console.log('Post Entry - Weight:', weight, 'Date:', selectedDate);

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
      alertMessage.innerHTML = "No future dates!";
    } else { 
      //Show image preview now that post is confirmed
      if (selectedImageData) {
        const gallery = document.querySelector('.gallery');
        if (gallery) {
          gallery.innerHTML = '';
          const img = document.createElement('img');
          img.src = selectedImageData;
          img.alt = 'Progress photo';
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100%';
          gallery.appendChild(img);
        }
      }
      
      alertMessage.classList.add('show');
      alertMessage.innerHTML = "Entry Added!";

      entryForm.classList.remove('show');
      addEntryButton.innerHTML = "<i class='bx bx-plus-medical'></i>";

      //Clear form fields
      document.getElementById('weight-progress-entry').value = '';
      document.getElementById('date-entry').value = '';
      
      //Reset file input if an image was uploaded
      if (fileInput) {
        fileInput.value = '';
      }

      setTimeout(function() {
        alertMessage.classList.remove('show');
      }, 2000);

      //Pass the selected image data to the appendProgressLog function
      appendProgressLog(weight, selectedDate, selectedImageData);
      
      //Reset the selected image data after submitting
      selectedImageData = null;
    }
  }
});

//Function to append a new weight entry to the weight progress log and update the chart
function appendProgressLog(weight, date, imageData) {
  if (weight > 0 && date) { 
    //Format the date consistently to avoid timezone issues
    const formattedDate = formatDateString(date);
    
    //Get the user's unique ID to store weight data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || (userData.profile && userData.profile._id);
    
    if (!userId) {
      console.error('Cannot record weight - no user ID found');
      return;
    }
    
    //Add to UI progress log at the top (prepend instead of append)
    const progressLog = document.getElementById('progresslogdata');
    const progressLogItem = document.createElement('div');
    progressLogItem.className = 'progresslog-item';

    //Add class if there's an image attached
    if (imageData) {
      progressLogItem.classList.add('progresslog-item-with-image');
    }
    
    progressLogItem.innerHTML = `${weight} lbs <span style="font-size: 14px; color: black; font-style: italic; color: #757575;">(${formattedDate})</span><i class='bx bxs-trash trash-icon' onClick="deleteProgressLog(this, '${formattedDate}', ${weight})"></i>`;
    progressLogItem.dataset.date = formattedDate;
    progressLogItem.dataset.weight = weight;
    
    //Add click event to show image in gallery
    if (imageData) {
      progressLogItem.addEventListener('click', function() {
        displayImageInGallery(formattedDate);
      });
    }
    
    //Insert at the beginning of the log (newest first)
    if (progressLog.firstChild) {
      progressLog.insertBefore(progressLogItem, progressLog.firstChild);
    } else {
    progressLog.appendChild(progressLogItem);
    }

    if (progressLog.children.length > 0) {
      progressLog.classList.add('visible');
    }
    
    //Save to localStorage for persistence
    const weightsKey = `healthai_weights_${userId}`;
    let weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
    
    //Check if entry for this date already exists
    let entryExists = false;
    for (let i = 0; i < weights.length; i++) {
      //Normalize both dates for comparison
      const existingDate = weights[i].date;
      
      if (existingDate === formattedDate) {
        //Update existing entry with new weight
        weights[i].weight = parseFloat(weight);
        //If we have image data, update it too
        if (imageData) {
          weights[i].image = imageData;
        }
        entryExists = true;
        break;
      }
    }
    
    //Add new entry if it doesn't exist
    if (!entryExists) {
      weights.push({
        date: formattedDate,
        weight: parseFloat(weight),
        image: imageData || null
      });
    }
    
    //Sort by date for chart display (oldest to newest)
    weights.sort((a, b) => {
      //Parse dates for comparison
      const dateA = a.date.split('-');
      const dateB = b.date.split('-');
      return new Date(dateA[0], dateA[1] - 1, dateA[2]) - new Date(dateB[0], dateB[1] - 1, dateB[2]);
    });
    
    console.log('Weight entries after adding:', weights);
    
    //Save updated weights
    localStorage.setItem(weightsKey, JSON.stringify(weights));
    console.log(`Recorded weight ${weight} lbs for user ${userId} on ${formattedDate}`);
    
    //CRITICAL: Force the chart to update immediately - this ensures the chart shows each new entry
    if (window.weightChart) {
      console.log('Destroying existing chart to refresh with new data');
      window.weightChart.destroy();
      window.weightChart = null;
    }
    
    //Update the weight chart with the new data
    updateWeightChart(weights);
  }
}

//Helper function to format date string consistently as YYYY-MM-DD
function formatDateString(dateStr) {
  //Check if it's already a YYYY-MM-DD string
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  //Parse the date using local time to avoid timezone issues
  const date = new Date(dateStr);
  const year = date.getFullYear();
  //Months and days need to be padded with leading zeros
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

//Function to delete a progress log entry
function deleteProgressLog(element, date, weight) {
  //Prevent the click from bubbling up to the parent (which would display the image)
  event.stopPropagation();
  
  //Format the date consistently to avoid timezone issues
  const formattedDate = formatDateString(date);
  
  //Delete without confirmation
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot delete entry - no user ID found');
    return;
  }
  
  const weightsKey = `healthai_weights_${userId}`;
  let weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
  
  //Remove the entry for the given date
  weights = weights.filter(item => item.date !== formattedDate);
  
  //Save the updated weights
  localStorage.setItem(weightsKey, JSON.stringify(weights));
  
  //Remove the entry from the UI
  const progressLogItem = element.parentElement;
  progressLogItem.remove();
  
  //Force chart refresh by destroying it first
  if (window.weightChart) {
    console.log('Destroying existing chart to refresh after deletion');
    window.weightChart.destroy();
    window.weightChart = null;
  }
  
  //Update the chart with the new data
  if (weights.length > 0) {
    updateWeightChart(weights);
  } else {
    //If no entries left, clear the chart area
    const weightChartCanvas = document.getElementById('linechart');
    if (weightChartCanvas) {
      const ctx = weightChartCanvas.getContext('2d');
      ctx.clearRect(0, 0, weightChartCanvas.width, weightChartCanvas.height);
    }
  }
  
  //Hide the progress log if there are no more entries
  const progressLog = document.getElementById('progresslogdata');
  if (progressLog.children.length === 0) {
    progressLog.classList.remove('visible');
  }
  
  //Clear the gallery if it's currently displaying the deleted entry
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    gallery.innerHTML = `<i class='bx bx-image-alt'></i>`;
  }
}

//Function to display an image in the gallery
function displayImageInGallery(date) {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  
  //Format the date consistently to avoid timezone issues
  const formattedDate = formatDateString(date);
  
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  if (!userId) {
    console.error('Cannot display image - no user ID found');
    return;
  }
  
  const weightsKey = `healthai_weights_${userId}`;
  const weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
  
  //Find the entry for the given date
  const entry = weights.find(item => item.date === formattedDate);
  
  //Clear the gallery
  gallery.innerHTML = '';
  
  if (entry && entry.image) {
    //Create an image element and set the source to the base64 data
    const img = document.createElement('img');
    img.src = entry.image;
    img.alt = `Progress photo from ${formattedDate}`;
    img.classList.add('gallery-image');
    gallery.appendChild(img);
    console.log(`Displayed image for entry dated ${formattedDate}`);
  } else {
    //Display a placeholder if no image is available
    gallery.innerHTML = `<div class="no-image-placeholder">
      <i class='bx bx-image-alt'></i>
      <p>No image available</p>
    </div>`;
    console.log(`No image found for entry dated ${formattedDate}`);
  }
}

//Function to update the existing weight chart with new data
function updateWeightChart(weights) {
  //Find the weight chart on the page
  const weightChartCanvas = document.getElementById('linechart');
  
  if (!weightChartCanvas) {
    console.log('Weight chart canvas not found on this page');
    return;
  }
  
  if (!weights || weights.length === 0) {
    console.log('No weight data available to update chart');
    return;
  }
  
  console.log('Updating weight chart with data:', weights);
  
  //Ensure weights are sorted by date (chronological order)
  weights.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  //Prepare data for chart - Fix date handling to avoid timezone issues
  const labels = weights.map(entry => {
    //Parse the date and handle timezone issues by using the date parts directly
    const dateParts = entry.date.split('-');
    //JS months are 0-indexed, so subtract 1 from month
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  
  const data = weights.map(entry => entry.weight);
  
  console.log('Chart data prepared:', { labels, data });
  
  //Check if chart already exists as a Chart.js instance
  if (window.weightChart) {
    //Update existing chart
    window.weightChart.data.labels = labels;
    window.weightChart.data.datasets[0].data = data;
    window.weightChart.update();
    console.log('Existing weight chart updated with new data');
  } else {
    //Create new chart
    window.weightChart = new Chart(weightChartCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Weight (lbs)',
          data: data,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'white'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'white'
            }
          }
        },
        plugins: {
          legend: {
            display: false //Hide the legend
          }
        }
      }
    });
    console.log('New weight chart created');
  }
}

//Load weight data when page loads and update the chart
document.addEventListener("DOMContentLoaded", function() {
  //Load any existing weight data and update the chart
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData._id || (userData.profile && userData.profile._id);
  
  //Variable to ensure we don't have duplicate image upload handlers
  if (window._weightChartInitialized) {
    console.log('Weight chart already initialized, skipping duplicate initialization');
    return;
  }
  window._weightChartInitialized = true;
  
  if (userId) {
    const weightsKey = `healthai_weights_${userId}`;
    let weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
    
    if (weights.length > 0) {
      console.log(`Loaded ${weights.length} weight entries for chart:`, weights);
      
      //Clean up and standardize date formats
      weights = weights.map(entry => {
        return {
          ...entry,
          date: formatDateString(entry.date)
        };
      });
      
      //Ensure weights are sorted by date
      const sortedWeights = [...weights].sort((a, b) => {
        //Parse dates for comparison
        const dateA = a.date.split('-');
        const dateB = b.date.split('-');
        return new Date(dateA[0], dateA[1] - 1, dateA[2]) - new Date(dateB[0], dateB[1] - 1, dateB[2]);
      });
      
      //Check if any duplicates exist and resolve them
      const uniqueDates = new Set();
      const uniqueWeights = [];
      
      sortedWeights.forEach(entry => {
        const dateKey = entry.date;
        if (!uniqueDates.has(dateKey)) {
          uniqueDates.add(dateKey);
          uniqueWeights.push(entry);
        } else {
          console.log(`Found duplicate entry for date ${dateKey}, using latest value`);
        }
      });
      
      //If we cleaned up any duplicates, save the clean data back
      if (uniqueWeights.length !== weights.length) {
        console.log(`Cleaned up weight data: ${weights.length} entries -> ${uniqueWeights.length} entries`);
        localStorage.setItem(weightsKey, JSON.stringify(uniqueWeights));
      }
      
      //Update the chart with cleaned data - force a fresh chart
      if (window.weightChart) {
        window.weightChart.destroy();
        window.weightChart = null;
      }
      updateWeightChart(uniqueWeights.length > 0 ? uniqueWeights : sortedWeights);
      
      //Also populate the progress log UI
      const progressLog = document.getElementById('progresslogdata');
      if (progressLog) {
        //Clear existing entries
        progressLog.innerHTML = '';
        
        //Add each weight entry to the UI in REVERSE chronological order (newest first)
        const displayWeights = [...(uniqueWeights.length > 0 ? uniqueWeights : sortedWeights)]
          .sort((a, b) => {
            //Parse dates for comparison (newest first)
            const dateA = a.date.split('-');
            const dateB = b.date.split('-');
            return new Date(dateB[0], dateB[1] - 1, dateB[2]) - new Date(dateA[0], dateA[1] - 1, dateA[2]);
          });
        
        displayWeights.forEach(entry => {
          const progressLogItem = document.createElement('div');
          progressLogItem.className = 'progresslog-item';
          
          //Add class if there's an image attached
          if (entry.image) {
            progressLogItem.classList.add('progresslog-item-with-image');
          }
          
          //Use the standardized date format
          progressLogItem.innerHTML = `${entry.weight} lbs <span style="font-size: 14px; color: black; font-style: italic; color: #757575;">(${entry.date})</span><i class='bx bxs-trash trash-icon' onClick="deleteProgressLog(this, '${entry.date}', ${entry.weight})"></i>`;
          progressLogItem.dataset.date = entry.date;
          progressLogItem.dataset.weight = entry.weight;
          
          //Add click event to show image in gallery if it has one
          if (entry.image) {
            progressLogItem.addEventListener('click', function() {
              displayImageInGallery(entry.date);
            });
          }
          
          progressLog.appendChild(progressLogItem);
        });
        
        //Show the log if it has entries
        if (progressLog.children.length > 0) {
          progressLog.classList.add('visible');
        }
      }
    }
  }
  
  console.log('Weight chart initialization complete');
});

/************************************************************************************************************************************** */

document.addEventListener("DOMContentLoaded", function() {
  const onepicBtn = document.getElementById('onepicbtn'); //grabs both gallery buttons 
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

/************************************************************************************************************************************** */

//Health information form handling
document.addEventListener("DOMContentLoaded", function() {
  console.log('Setting up health form handlers');
  
  //Load health data immediately when the page loads
  loadHealthData();
  
  //Get form elements
  const healthForm = document.querySelector('.bodyinfocontainer');
  const updateButton = document.getElementById('updatebtn');
  const resetButton = document.getElementById('resetbtn');
  
  console.log('Update button found:', !!updateButton);
  console.log('Reset button found:', !!resetButton);

  //Get input fields
  const ageInput = document.getElementById('age');
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const maleRadio = document.getElementById('radio1');
  const femaleRadio = document.getElementById('radio2');
  const goalWeightInput = document.getElementById('goalweight');
  const weeklyGoalLabel = document.getElementById('weeklygoalLabel');
  const activityLevelLabel = document.getElementById('activityLabel');
  
  //Setup weekly goal dropdown items
  const weeklyGoalItems = document.querySelectorAll('.wklygoallist a');
  weeklyGoalItems.forEach(item => {
    item.addEventListener('click', function() {
      weeklyGoalLabel.textContent = this.textContent;
    });
  });
  
  //Setup activity level dropdown items
  const activityLevelItems = document.querySelectorAll('.activitymenu a');
  activityLevelItems.forEach(item => {
    item.addEventListener('click', function() {
      activityLevelLabel.textContent = this.textContent;
    });
  });

  //Function to get user token
  function getUserToken() {
    return localStorage.getItem('healthai_token') || localStorage.getItem('token');
  }

  //Function to calculate calorie needs using the Mifflin-St Jeor Equation
  function calculateCalorieNeeds(healthData) {
    if (!healthData || !healthData.age || !healthData.height || !healthData.weight || !healthData.gender || !healthData.activityLevel) {
      console.log('Cannot calculate calories - missing required health data');
      return null;
    }

    //Extract necessary data
    const age = healthData.age;
    const gender = healthData.gender;
    
    //Convert height from inches to cm
    const heightCm = healthData.height * 2.54;
    
    //Convert weight from lbs to kg
    const weightKg = healthData.weight * 0.45359237;
    
    //Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'female') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    } else { //male
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    }
    
    //Determine activity multiplier
    let activityMultiplier;
    const activityLevelLower = healthData.activityLevel.toLowerCase();
    if (activityLevelLower.includes('not active') || activityLevelLower.includes('sedentary')) {
      activityMultiplier = 1.2;
    } else if (activityLevelLower.includes('lightly active') || activityLevelLower.includes('light')) {
      activityMultiplier = 1.375;
    } else if (activityLevelLower.includes('moderately active') || activityLevelLower.includes('moderate') || activityLevelLower.includes('active')) {
      activityMultiplier = 1.55;
    } else if (activityLevelLower.includes('very active') || activityLevelLower.includes('extra active')) {
      activityMultiplier = 1.725;
    } else {
      //Default to sedentary if not specified or recognized
      activityMultiplier = 1.2;
      console.log('Activity level not recognized, defaulting to sedentary:', healthData.activityLevel);
    }
    
    //Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityMultiplier;
    
    //Calculate calorie needs for different goals
    const calorieNeeds = {
      lose05lb: Math.round(tdee - 250),
      lose1lb: Math.round(tdee - 500),
      gain05lb: Math.round(tdee + 250),
      gain1lb: Math.round(tdee + 500),
      maintain: Math.round(tdee)
    };
    
    console.log('Calorie calculations:', {
      age, gender, 
      heightCm: heightCm.toFixed(2), 
      weightKg: weightKg.toFixed(2), 
      bmr: bmr.toFixed(2), 
      activity: healthData.activityLevel, 
      multiplier: activityMultiplier, 
      tdee: tdee.toFixed(2),
      calorieNeeds
    });
    
    return calorieNeeds;
  }

  //Function to update the calorie insight section with calculated values
  function updateCalorieInsights(calorieNeeds) {
    if (!calorieNeeds) {
      return;
    }
    
    //Get the calorie insight container input elements
    const lose05Container = document.getElementById('calorie1');
    const lose1Container = document.getElementById('calorie2');
    const maintainContainer = document.getElementById('calorie3');
    const gain05Container = document.getElementById('calorie4');
    const gain1Container = document.getElementById('calorie5');
    
    //Update the displayed values
    if (lose05Container) lose05Container.value = `${calorieNeeds.lose05lb} kcal`;
    if (lose1Container) lose1Container.value = `${calorieNeeds.lose1lb} kcal`;
    if (maintainContainer) maintainContainer.value = `${calorieNeeds.maintain} kcal`;
    if (gain05Container) gain05Container.value = `${calorieNeeds.gain05lb} kcal`;
    if (gain1Container) gain1Container.value = `${calorieNeeds.gain1lb} kcal`;
  }

  //Function to save health data to localStorage
  function saveHealthDataToLocalStorage(healthData) {
    try {
      //Save the health data to localStorage
      localStorage.setItem('healthai_health_data', JSON.stringify(healthData));
      console.log('Health data saved to localStorage:', healthData);
    } catch (error) {
      console.error('Error saving health data to localStorage:', error);
    }
  }

  //Function to load health data from localStorage
  function loadHealthDataFromLocalStorage() {
    try {
      const savedData = localStorage.getItem('healthai_health_data');
      if (savedData) {
        const healthData = JSON.parse(savedData);
        console.log('Health data loaded from localStorage:', healthData);
        return healthData;
      }
    } catch (error) {
      console.error('Error loading health data from localStorage:', error);
    }
    return null;
  }

  //Function to load existing health data - modified to include calorie calculations
  async function loadHealthData() {
    try {
      //First try to load from localStorage
      const localData = loadHealthDataFromLocalStorage();
      if (localData) {
        console.log('Using health data from localStorage');
        populateFormWithHealthData(localData);
        return;
      }

      const token = getUserToken();
      if (!token) {
        console.log('No token found, user needs to login');
        return;
      }

      console.log('Fetching health data with token');
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Health data loaded from server:', data);
        
        //Save the data to localStorage for future use
        saveHealthDataToLocalStorage(data);
        
        //Populate the form with the data
        populateFormWithHealthData(data);
      } else {
        console.error('Failed to load health data:', await response.text());
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  }

  //Function to populate form with health data
  function populateFormWithHealthData(data) {
    //Get input fields
    const ageInput = document.getElementById('age');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const maleRadio = document.getElementById('radio1');
    const femaleRadio = document.getElementById('radio2');
    const goalWeightInput = document.getElementById('goalweight');
    const weeklyGoalLabel = document.getElementById('weeklygoalLabel');
    const activityLevelLabel = document.getElementById('activityLabel');
        
        //Populate form fields with existing data
        if (data.age) ageInput.value = data.age;
        if (data.height) heightInput.value = data.height;
        if (data.weight) weightInput.value = data.weight;
        
        //Set gender radio buttons
        if (data.gender === 'male') {
          maleRadio.checked = true;
        } else if (data.gender === 'female') {
          femaleRadio.checked = true;
        }
        
        if (data.goalWeight) goalWeightInput.value = data.goalWeight;
        if (data.weeklyGoal) weeklyGoalLabel.textContent = data.weeklyGoal;
        if (data.activityLevel) activityLevelLabel.textContent = data.activityLevel;
        
        //Update BMI display if available
        if (data.bmi) {
          const bmiDisplay = document.querySelector('.bmi-number');
          if (bmiDisplay) {
            bmiDisplay.textContent = data.bmi;
            
            //Update BMI category
            const bmiCategory = document.querySelector('.bmi-category');
            if (bmiCategory) {
              if (data.bmi < 18.5) {
                bmiCategory.textContent = 'Underweight';
              } else if (data.bmi >= 18.5 && data.bmi < 25) {
                bmiCategory.textContent = 'Normal';
              } else if (data.bmi >= 25 && data.bmi < 30) {
                bmiCategory.textContent = 'Overweight';
              } else {
                bmiCategory.textContent = 'Obese';
              }
            }
            
            //Scroll to the BMI value and position arrow on page load
            setTimeout(() => {
              scrollToBMI(data.bmi);
              positionArrowAtBMI(data.bmi);
            }, 500);
          }
        } else if (data.height && data.weight) {
          //Calculate BMI if not provided by the server
          const weightKg = data.weight * 0.45359237;
          const heightMeters = data.height * 0.0254;
          const bmi = weightKg / (heightMeters * heightMeters);
          const roundedBMI = parseFloat(bmi.toFixed(1));
          
          const bmiDisplay = document.querySelector('.bmi-number');
          if (bmiDisplay) {
            bmiDisplay.textContent = roundedBMI;
            
            //Update BMI category
            const bmiCategory = document.querySelector('.bmi-category');
            if (bmiCategory) {
              if (roundedBMI < 18.5) {
                bmiCategory.textContent = 'Underweight';
              } else if (roundedBMI >= 18.5 && roundedBMI < 25) {
                bmiCategory.textContent = 'Normal';
              } else if (roundedBMI >= 25 && roundedBMI < 30) {
                bmiCategory.textContent = 'Overweight';
              } else {
                bmiCategory.textContent = 'Obese';
              }
            }
            
            //Scroll to the BMI value and position arrow on page load
            setTimeout(() => {
              scrollToBMI(roundedBMI);
              positionArrowAtBMI(roundedBMI);
            }, 500);
          }
        }
        
        //Calculate and update calorie needs
        if (data.age && data.height && data.weight && data.gender && data.activityLevel) {
          const calorieNeeds = calculateCalorieNeeds(data);
          updateCalorieInsights(calorieNeeds);
    }
  }

  //Event listener for update button
  if (updateButton) {
    updateButton.addEventListener('click', async function(event) {
      event.preventDefault();
      console.log('Update button clicked');
      
      //Get gender value
      let gender = '';
      if (maleRadio.checked) {
        gender = 'male';
      } else if (femaleRadio.checked) {
        gender = 'female';
      }
      
      //Get form values
      const healthData = {
        age: parseInt(ageInput.value) || 0,
        height: parseFloat(heightInput.value) || 0,
        weight: parseFloat(weightInput.value) || 0,
        gender: gender,
        goalWeight: parseFloat(goalWeightInput.value) || 0,
        weeklyGoal: weeklyGoalLabel.textContent || '',
        activityLevel: activityLevelLabel.textContent || ''
      };
      
      console.log('Submitting health data:', healthData);
      
      //Calculate BMI before submission to show the visual feedback
      if (healthData.height > 0 && healthData.weight > 0) {
        //Convert to metric for calculation
        const weightKg = healthData.weight * 0.45359237;
        const heightMeters = healthData.height * 0.0254;
        
        //Calculate BMI
        const bmi = weightKg / (heightMeters * heightMeters);
        const roundedBMI = parseFloat(bmi.toFixed(1));
        
        //Add BMI to health data
        healthData.bmi = roundedBMI;
        
        //Scroll to the BMI value with animation
        setTimeout(() => {
          scrollToBMI(roundedBMI);
          //Position the arrow at the BMI value
          positionArrowAtBMI(roundedBMI);
        }, 300);
      }
      
      //Calculate and update calorie needs based on form input
      if (healthData.age && healthData.height && healthData.weight && healthData.gender && healthData.activityLevel) {
        const calorieNeeds = calculateCalorieNeeds(healthData);
        updateCalorieInsights(calorieNeeds);
      }
      
      //Save to localStorage first to ensure data persistence
      saveHealthDataToLocalStorage(healthData);
      
      try {
        const token = getUserToken();
        if (!token) {
          alert('Please log in to update health information');
          return;
        }
        
        console.log('Sending update request with token');
        const response = await fetch('/api/health', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(healthData)
        });
        
        const data = await response.json();

        if (response.ok) {
          console.log('Health data updated:', data);
          
          //Update dashboard with health data
          updateDashboardWithHealthData(data);
          
          //Show success message
          const alertMessage = document.createElement('div');
          alertMessage.className = 'alert-message success';
          alertMessage.innerHTML = '<i class="bx bx-check-circle"></i> Health information updated successfully';
          document.querySelector('.bodyinfocontainer').prepend(alertMessage);
          
          //Remove alert after 3 seconds
          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
          
          //Reset dropdown icons to their default state
          const weeklyGoalIcon = document.querySelector('.weeklygoalbtn i');
          const activityIcon = document.querySelector('.activitybtn i');
          
          if (weeklyGoalIcon) {
            weeklyGoalIcon.style.transform = 'rotate(0deg)';
          }
          
          if (activityIcon) {
            activityIcon.style.transform = 'rotate(0deg)';
          }
          
          //Remove any 'clicked' classes from the buttons
          document.querySelector('.weeklygoalbtn')?.classList.remove('clicked');
          document.querySelector('.activitybtn')?.classList.remove('clicked');
          
          //Hide any visible dropdown menus
          document.querySelector('.wklygoallist')?.classList.remove('show');
          document.querySelector('.activitymenu')?.classList.remove('show');
        } else {
          console.error('Failed to update health data:', data.message || 'Failed to update health information');
          
          //Show error message
          const alertMessage = document.createElement('div');
          alertMessage.className = 'alert-message error';
          alertMessage.innerHTML = '<i class="bx bx-error-circle"></i> Failed to update health information';
          document.querySelector('.bodyinfocontainer').prepend(alertMessage);
          
          //Remove alert after 3 seconds
          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
        }
      } catch (error) {
        console.error('Error updating health data:', error);
        
        //Show error message
        const alertMessage = document.createElement('div');
        alertMessage.className = 'alert-message error';
        alertMessage.innerHTML = '<i class="bx bx-error-circle"></i> An error occurred while updating health information';
        document.querySelector('.bodyinfocontainer').prepend(alertMessage);
        
        //Remove alert after 3 seconds
        setTimeout(() => {
          alertMessage.remove();
        }, 3000);
      }
    });
  } else {
    console.error('Update button not found in the DOM');
  }

  //Event listener for reset button
  if (resetButton) {
    resetButton.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('Reset button clicked');
      
      //Reset form fields
      ageInput.value = '';
      heightInput.value = '';
      weightInput.value = '';
      maleRadio.checked = false;
      femaleRadio.checked = false;
      goalWeightInput.value = '';
      weeklyGoalLabel.textContent = '';
      activityLevelLabel.textContent = '';
      
      //Clear localStorage data
      localStorage.removeItem('healthai_health_data');
      
      //Show reset message
      const alertMessage = document.createElement('div');
      alertMessage.className = 'alert-message info';
      alertMessage.innerHTML = '<i class="bx bx-info-circle"></i> Form has been reset';
      document.querySelector('.bodyinfocontainer').prepend(alertMessage);
      
      //Remove alert after 3 seconds
      setTimeout(() => {
        alertMessage.remove();
      }, 3000);
    });
  } else {
    console.error('Reset button not found in the DOM');
  }

  //Calculate BMI when height and weight change
  function calculateBMI() {
    const heightInches = parseFloat(heightInput.value);
    const weightLbs = parseFloat(weightInput.value);
    
    if (heightInches > 0 && weightLbs > 0) {
      //Convert pounds to kilograms
      const weightKg = weightLbs * 0.45359237;
      
      //Convert inches to meters
      const heightMeters = heightInches * 0.0254;
      
      //Standard scientific BMI formula: weight (kg) / height (m)^2
      const bmi = weightKg / (heightMeters * heightMeters);
      const roundedBMI = parseFloat(bmi.toFixed(1));
      
      console.log(`BMI Calculation: ${weightLbs} lbs (${weightKg.toFixed(2)} kg) / (${heightInches} in (${heightMeters.toFixed(2)} m))^2 = ${roundedBMI}`);
      
      //Update BMI display
      const bmiDisplay = document.querySelector('.bmi-number');
      if (bmiDisplay) {
        bmiDisplay.textContent = roundedBMI;
        
        //Update BMI category
        const bmiCategory = document.querySelector('.bmi-category');
        if (bmiCategory) {
          if (roundedBMI < 18.5) {
            bmiCategory.textContent = 'Underweight';
          } else if (roundedBMI >= 18.5 && roundedBMI < 25) {
            bmiCategory.textContent = 'Normal';
          } else if (roundedBMI >= 25 && roundedBMI < 30) {
            bmiCategory.textContent = 'Overweight';
          } else {
            bmiCategory.textContent = 'Obese';
          }
        }
      }
      
      //Scroll to the corresponding BMI in the box
      scrollToBMI(roundedBMI);
    }
  }
  
  //Function to scroll the BMI box to the calculated BMI value
  function scrollToBMI(bmiValue) {
    //Only scroll if the BMI is within the range displayed in the box
    if (bmiValue >= 14 && bmiValue <= 40) {
      const box = document.querySelector('.box');
      if (!box) return;
      
      //Temporarily enable pointer events for programmatic scrolling
      box.style.pointerEvents = 'auto';
      
      //Get all BMI items
      const items = box.querySelectorAll('.item');
      if (!items || items.length === 0) return;
      
      //Find the target item that corresponds to the calculated BMI
      let targetItem = null;
      let targetIndex = -1;
      let closestDiff = Infinity;
      
      for (let i = 0; i < items.length; i++) {
        const itemBMI = parseFloat(items[i].textContent);
        const diff = Math.abs(itemBMI - bmiValue);
        if (diff < closestDiff) {
          closestDiff = diff;
          targetItem = items[i];
          targetIndex = i;
        }
      }
      
      if (targetItem) {
        console.log(`Scrolling to BMI ${targetItem.textContent} (target: ${bmiValue})`);
        
        //Calculate the scroll position to center the target item
        const scrollLeft = targetItem.offsetLeft - (box.clientWidth / 2) + (targetItem.offsetWidth / 2);
        
        //Scroll to the target position with smooth animation
        box.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
        
        //Highlight the target item
        items.forEach(item => {
          item.style.transform = 'scale(1)';
          item.style.border = '3px solid white';
        });
        
        targetItem.style.transform = 'scale(1.1)';
        targetItem.style.border = '3px solid yellow';
        targetItem.style.transition = 'all 0.5s ease-in-out';
        
        //Reset the styling after animation
        setTimeout(() => {
          targetItem.style.transform = 'scale(1)';
          targetItem.style.border = '3px solid white';
          
          //Disable pointer events again
          box.style.pointerEvents = 'none';
        }, 2000);
      }
    }
  }

  //Add event listeners for BMI calculation
  if (heightInput && weightInput) {
    heightInput.addEventListener('input', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);
  }
});

//Add event listeners for sleep logging
document.addEventListener("DOMContentLoaded", function() {
  const logSleepBtn = document.getElementById('logsleep');
  if (logSleepBtn) {
    logSleepBtn.addEventListener('click', async function() {
      const sleepHours = parseInt(document.getElementById('sleep-hours').value) || 0;
      const sleepMinutes = parseInt(document.getElementById('sleep-minutes').value) || 0;
      
      if (sleepHours === 0 && sleepMinutes === 0) {
        alert('Please enter sleep time');
        return;
      }
      
      try {
        const token = localStorage.getItem('healthai_token');
        if (!token) {
          alert('Please log in to log sleep data');
          return;
        }
        
        const response = await fetch('/api/health/sleep', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            hours: sleepHours,
            minutes: sleepMinutes
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Sleep log added:', data);
          
          //Add the log to the UI
          const sleepLog = `${sleepHours}h ${sleepMinutes}m`;
          const currentDate = new Date().toISOString().split('T')[0];
          appendLog(sleepLog, currentDate);
          
          //Reset form
          document.getElementById('sleep-hours').value = '';
          document.getElementById('sleep-minutes').value = '';
          
          //Show success message
          const alertMessage = document.createElement('div');
          alertMessage.className = 'alert-message success';
          alertMessage.innerHTML = '<i class="bx bx-check-circle"></i> Sleep log added successfully';
          document.querySelector('.sleepcontainer').prepend(alertMessage);
          
          //Remove alert after 3 seconds
          setTimeout(() => {
            alertMessage.remove();
          }, 3000);
        } else {
          console.error('Failed to add sleep log');
          alert('Failed to add sleep log');
        }
      } catch (error) {
        console.error('Error adding sleep log:', error);
        alert('Error adding sleep log');
      }
    });
  }
});

//Function to position the arrow at the calculated BMI value
function positionArrowAtBMI(bmiValue) {
  const arrow = document.querySelector('.uparrow');
  const box = document.querySelector('.box');
  
  if (!arrow || !box) return;
  
  //Make sure the arrow is visible
  arrow.style.opacity = '1';
  
  //Add a highlight effect to the arrow
  arrow.classList.add('highlight');
  
  //Remove the highlight after animation
  setTimeout(() => {
    arrow.classList.remove('highlight');
  }, 2000);
}

function updateDashboardWithHealthData(healthData) {
  try {
    //Get user ID from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || (userData.profile && userData.profile._id);
    
    if (!userId) {
      console.error('Cannot update dashboard - no user ID found');
      return;
    }
    
    //Calculate calorie needs using Mifflin-St Jeor Equation
    if (healthData.age && healthData.height && healthData.weight && healthData.gender && healthData.activityLevel) {
      console.log('Calculating calorie needs with data:', healthData);
      
      //Calculate BMR using Mifflin-St Jeor Equation
      let bmr;
      if (healthData.gender.toLowerCase() === 'male') {
        bmr = 10 * healthData.weight + 6.25 * healthData.height - 5 * healthData.age + 5;
      } else {
        bmr = 10 * healthData.weight + 6.25 * healthData.height - 5 * healthData.age - 161;
      }
      
      //Apply activity multiplier
      const activityMultipliers = {
        'no exercise': 1.2,
        'lightly active': 1.375,
        'active': 1.55,
        'very active': 1.725
      };
      
      const activityLevel = healthData.activityLevel.toLowerCase();
      const multiplier = activityMultipliers[activityLevel] || 1.2;
      
      //Calculate TDEE
      const tdee = bmr * multiplier;
      
      //Calculate calorie goals for different scenarios
      const calorieNeeds = {
        maintain: Math.round(tdee),
        lose05lb: Math.round(tdee - 250),
        lose1lb: Math.round(tdee - 500),
        gain05lb: Math.round(tdee + 250),
        gain1lb: Math.round(tdee + 500)
      };
      
      //Determine calorie goal based on weekly goal
      let calorieGoal = calorieNeeds.maintain;
      
      if (healthData.weeklyGoal) {
        const weeklyGoal = healthData.weeklyGoal.toLowerCase();
        
        if (weeklyGoal.includes('lose') && weeklyGoal.includes('0.5')) {
          calorieGoal = calorieNeeds.lose05lb;
        } else if (weeklyGoal.includes('lose') && weeklyGoal.includes('1')) {
          calorieGoal = calorieNeeds.lose1lb;
        } else if (weeklyGoal.includes('gain') && weeklyGoal.includes('0.5')) {
          calorieGoal = calorieNeeds.gain05lb;
        } else if (weeklyGoal.includes('gain') && weeklyGoal.includes('1')) {
          calorieGoal = calorieNeeds.gain1lb;
        }
      }
      
      //Save calorie goal to all necessary locations
      localStorage.setItem(`healthai_calorieGoal_${userId}`, calorieGoal.toString());
      localStorage.setItem('CALORIE_GOAL', calorieGoal.toString());
      
      //Save health data to user data object
        let healthai_user_data = JSON.parse(localStorage.getItem('healthai_user_data') || '{}');
      healthai_user_data = {
        ...healthai_user_data,
        calorieGoal,
        currentWeight: healthData.weight,
        goalWeight: healthData.goalWeight,
        health: healthData
      };
        localStorage.setItem('healthai_user_data', JSON.stringify(healthai_user_data));
      
      //Save current and goal weights
      localStorage.setItem('CURRENT_WEIGHT', healthData.weight.toString());
      localStorage.setItem('GOAL_WEIGHT', healthData.goalWeight.toString());
      
      //Also save goal weight in the specific key that the dashboard is looking for
      localStorage.setItem(`healthai_goalWeight_${userId}`, healthData.goalWeight.toString());
      
      //Save weights history
      const weightsKey = `healthai_weights_${userId}`;
      const weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
      const today = new Date().toISOString().split('T')[0];
      
      //Add new weight entry
      weights.push({
        date: today,
        weight: parseFloat(healthData.weight)
      });
      
      //Sort weights by date
      weights.sort((a, b) => new Date(a.date) - new Date(b.date));
      localStorage.setItem(weightsKey, JSON.stringify(weights));
      
      //Create Glow-Up Gallery entry
      appendProgressLog(healthData.weight, today, null);
      
      //Update charts if they exist
      if (window.weightChart) {
        updateWeightChart(weights);
      }
      
      //Trigger dashboard refresh
      localStorage.setItem('healthai_refresh_dashboard', Date.now().toString());
      
      //Send broadcast message for cross-tab updates
        if (window.BroadcastChannel) {
          const bc = new BroadcastChannel('healthai_updates');
          bc.postMessage({
          type: 'HEALTH_UPDATE',
          data: {
            currentWeight: healthData.weight,
            goalWeight: healthData.goalWeight,
            calorieGoal: calorieGoal
          }
        });
      }
      
      //Dispatch custom event for same-window updates
      const updateEvent = new CustomEvent('healthDataUpdated', {
        detail: {
          currentWeight: healthData.weight,
          goalWeight: healthData.goalWeight,
          calorieGoal: calorieGoal
        }
      });
      document.dispatchEvent(updateEvent);
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating dashboard with health data:', error);
    return false;
  }
}

//Function to update the dashboard with the most recent weight data
function updateDashboardWithLatestWeight(userId) {
  try {
    //Get the most recent weight update
    const latestWeightKey = `healthai_latestWeight_${userId}`;
    const latestWeightData = JSON.parse(localStorage.getItem(latestWeightKey) || '{}');
    
    if (latestWeightData && latestWeightData.weight) {
      console.log(`Updating dashboard with latest weight: ${latestWeightData.weight} lbs from source: ${latestWeightData.source}`);
      
      //Update the current-weight element (this is the main display)
      const currentWeightElement = document.getElementById('current-weight');
      if (currentWeightElement) {
        currentWeightElement.textContent = latestWeightData.weight;
        console.log(`Updated current-weight element with value: ${latestWeightData.weight}`);
      } else {
        console.warn('Could not find current-weight element in the dashboard');
      }
      
      //Also update the weight in the stat-info section
      const weightElement = document.querySelector('.stat-item:nth-child(2) .stat-info p');
      if (weightElement) {
        weightElement.textContent = `${latestWeightData.weight} lbs`;
        console.log(`Updated weight in stat-info with value: ${latestWeightData.weight}`);
          }
        } else {
      console.log('No latest weight data found to update dashboard');
    }
    
    //Get the goal weight
    const goalWeightKey = `healthai_goalWeight_${userId}`;
    const goalWeight = localStorage.getItem(goalWeightKey);
    
    if (goalWeight) {
      //Update the goal weight in the stat-tags section
      const goalWeightTag = document.querySelector('.stat-item:nth-child(2) .stat-tags .tag:first-child');
      if (goalWeightTag) {
        goalWeightTag.textContent = `Goal: ${goalWeight} lbs`;
        console.log(`Updated goal weight tag with value: ${goalWeight}`);
    } else {
        console.warn('Could not find goal weight tag in the dashboard');
      }
      
      //Also update any other goal weight elements
      const goalWeightElements = document.querySelectorAll('.goal-weight');
      goalWeightElements.forEach(element => {
        element.textContent = goalWeight;
        console.log(`Updated additional goal-weight element with value: ${goalWeight}`);
      });
    }
  } catch (error) {
    console.error('Error updating dashboard with latest weight:', error);
  }
}

//Modify the appendProgressLog function to also update the latest weight
function appendProgressLog(weight, date, imageData) {
  if (weight > 0 && date) { 
    //Format the date consistently to avoid timezone issues
  const formattedDate = formatDateString(date);
  
    //Get the user's unique ID to store weight data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || (userData.profile && userData.profile._id);
    
    if (!userId) {
      console.error('Cannot record weight - no user ID found');
      return;
    }
    
    //Add to UI progress log at the top (prepend instead of append)
    const progressLog = document.getElementById('progresslogdata');
    const progressLogItem = document.createElement('div');
    progressLogItem.className = 'progresslog-item';

    //Add class if there's an image attached
    if (imageData) {
      progressLogItem.classList.add('progresslog-item-with-image');
    }
    
    progressLogItem.innerHTML = `${weight} lbs <span style="font-size: 14px; color: black; font-style: italic; color: #757575;">(${formattedDate})</span><i class='bx bxs-trash trash-icon' onClick="deleteProgressLog(this, '${formattedDate}', ${weight})"></i>`;
    progressLogItem.dataset.date = formattedDate;
    progressLogItem.dataset.weight = weight;
    
    //Add click event to show image in gallery
    if (imageData) {
      progressLogItem.addEventListener('click', function() {
        displayImageInGallery(formattedDate);
      });
    }
    
    //Insert at the beginning of the log (newest first)
    if (progressLog.firstChild) {
      progressLog.insertBefore(progressLogItem, progressLog.firstChild);
    } else {
      progressLog.appendChild(progressLogItem);
    }
    
    if (progressLog.children.length > 0) {
      progressLog.classList.add('visible');
    }
    
    //Save to localStorage for persistence
    const weightsKey = `healthai_weights_${userId}`;
    let weights = JSON.parse(localStorage.getItem(weightsKey) || '[]');
    
    //Check if entry for this date already exists
    let entryExists = false;
    for (let i = 0; i < weights.length; i++) {
      //Normalize both dates for comparison
      const existingDate = weights[i].date;
      
      if (existingDate === formattedDate) {
        //Update existing entry with new weight
        weights[i].weight = parseFloat(weight);
        //If we have image data, update it too
        if (imageData) {
          weights[i].image = imageData;
        }
        entryExists = true;
        break;
      }
    }
    
    //Add new entry if it doesn't exist
    if (!entryExists) {
      weights.push({
        date: formattedDate,
        weight: parseFloat(weight),
        image: imageData || null
      });
    }
    
    //Sort by date for chart display (oldest to newest)
    weights.sort((a, b) => {
      //Parse dates for comparison
      const dateA = a.date.split('-');
      const dateB = b.date.split('-');
      return new Date(dateA[0], dateA[1] - 1, dateA[2]) - new Date(dateB[0], dateB[1] - 1, dateB[2]);
    });
    
    console.log('Weight entries after adding:', weights);
    
    //Save updated weights
    localStorage.setItem(weightsKey, JSON.stringify(weights));
    console.log(`Recorded weight ${weight} lbs for user ${userId} on ${formattedDate}`);
    
    //CRITICAL: Save the most recent weight update with timestamp
    const currentTimestamp = Date.now();
    const latestWeightKey = `healthai_latestWeight_${userId}`;
    localStorage.setItem(latestWeightKey, JSON.stringify({
      weight: parseFloat(weight),
      timestamp: currentTimestamp,
      source: 'glow_up_gallery'
    }));
    console.log(`Saved latest weight update: ${weight} lbs from Glow-Up Gallery`);
    
    //Also update in user data object
    try {
      let healthai_user_data = JSON.parse(localStorage.getItem('healthai_user_data') || '{}');
      healthai_user_data.currentWeight = weight;
      healthai_user_data.latestWeightUpdate = {
        weight: parseFloat(weight),
        timestamp: currentTimestamp,
        source: 'glow_up_gallery'
      };
      localStorage.setItem('healthai_user_data', JSON.stringify(healthai_user_data));
    } catch (err) {
      console.error('Error saving latest weight to user data object:', err);
    }
    
    //Also save a global current weight key for backward compatibility
    localStorage.setItem('CURRENT_WEIGHT', weight.toString());
    
    //CRITICAL: Force the chart to update immediately - this ensures the chart shows each new entry
    if (window.weightChart) {
      console.log('Destroying existing chart to refresh with new data');
      window.weightChart.destroy();
      window.weightChart = null;
    }
    
    //Update the weight chart with the new data
    updateWeightChart(weights);
    
    //If we're on the dashboard page, update it with the latest weight
    if (window.location.href.includes('/HTML/index.html')) {
      updateDashboardWithLatestWeight(userId);
      
      //Dispatch a custom event to notify the dashboard that weight data has been updated
      const weightUpdateEvent = new CustomEvent('weightDataUpdated', {
        detail: {
          currentWeight: weight,
          timestamp: currentTimestamp,
          source: 'glow_up_gallery'
        }
      });
      document.dispatchEvent(weightUpdateEvent);
      console.log('Dispatched weightDataUpdated event to notify dashboard');
    }
  }
}

//Add an event listener to the dashboard page to update when weight data changes
document.addEventListener('DOMContentLoaded', function() {
  //Check if we're on the dashboard page
  if (window.location.href.includes('/HTML/index.html')) {
    //Get user ID
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || (userData.profile && userData.profile._id);
    
    if (userId) {
      //Update the dashboard with the latest weight data
      updateDashboardWithLatestWeight(userId);
      
      //Listen for weight data updates
      document.addEventListener('weightDataUpdated', function(event) {
        console.log('Received weightDataUpdated event:', event.detail);
        updateDashboardWithLatestWeight(userId);
      });
      
      //Also listen for storage events (for cross-tab updates)
      window.addEventListener('storage', function(event) {
        if (event.key && event.key.startsWith('healthai_latestWeight_')) {
          console.log('Storage event for latest weight update:', event.key);
          updateDashboardWithLatestWeight(userId);
        }
      });
    }
  }
});
