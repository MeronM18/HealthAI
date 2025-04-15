document.addEventListener('DOMContentLoaded', function() { //load all elements on the page
  const textarea = document.getElementById('chat-text'); //grabs the textarea where user write prompts to chat
  const searchBtn = document.getElementById('search'); //searchbtn to send the prompt to chat and get response
  const loader = document.querySelector('.loader'); //loading when processing prompts
  const chatContainer = document.querySelector('.chat-container'); //chat container for messages
  const chatMessagesContainer = document.getElementById('chat-messages-container'); //chat messages container
  
  // Get user ID from localStorage
  const userId = localStorage.getItem('userId') || 'default';
  
  // Function to scroll to the bottom of the chat container
  function scrollToBottom() {
    // Use setTimeout to ensure the DOM has updated before scrolling
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 10);
  }
  
  function autoResize() { //resize the textarea based on size of prompt
    textarea.style.height = '3rem'; //set the height to fixed 3 rem initially
    
    const newHeight = Math.min(textarea.scrollHeight, 300); //this calculation caps the maximum height of the textarea at 300 pixels before allowing scroll
    textarea.style.height = newHeight + 'px'; //now the text area's new height is set to the calculated height from last line to ensure autoresizing
  }
  
  function updateSearchButtonVisibility() { //function to show the searchbutton
    if(textarea.value.trim() !== '') { //checks if the text content inside textarea is not empty while removing white spaces from beginning and end of text
      if(searchBtn.classList.contains('hidden')) { //if initially hidden, then remove the hidden class and show the button when there is content in search
        searchBtn.classList.remove('hidden');
        searchBtn.classList.add('pop-in'); //also add an animation to when the button is visible
        
        searchBtn.addEventListener('animationend', function() { //when animation time ends, this will remove the animation
          searchBtn.classList.remove('pop-in');
        }, {once: true}); //will only run once and then remove itself
      }
    } else { //if content area is empty 
      searchBtn.classList.add('hidden'); //button will be hidden
      searchBtn.classList.remove('pop-in'); //no animation 
    }
  }
  
  updateSearchButtonVisibility(); //call the function and perform it
  
  textarea.addEventListener('input', function() { //now when there is input in the textarea. it will call both the resize page function and show button visibilty function
    autoResize();
    updateSearchButtonVisibility();
  });

  let buttonClicked = false; //originally set the searchbutton clicked to false
  
  function typeText(element, text, speed, callback) { //function to create a typing animation 
    element.placeholder = ''; //set the element content to empty to work properly 
    let charIndex = 0; //creates a variable to start at the first character of word
    
    const typingInterval = setInterval(() => { //timer that repeatedly executes code inside function 
      if (charIndex < text.length) { //checks if there are characters left to type
        element.placeholder += text.charAt(charIndex); //when there are characters left to type, this will then add the characters to the placeholder
        charIndex++; //go to next character
      } else { //if no characters left to type
        clearInterval(typingInterval); //stops timer when animation completes
        if (callback) callback(); //checks if callback function was provided and call function
      }
    }, speed);
  }
  
  // Function to animate text in a message element
  function animateMessageText(element, text, speed, callback) {
    element.textContent = ''; // Clear the element
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        scrollToBottom(); // Keep scrolling as text is typed
      } else {
        clearInterval(typingInterval);
        if (callback) callback();
      }
    }, speed);
  }
  
  // Function to save chat history to localStorage
  function saveChatHistory(message, isUser = true) {
    try {
      // Get existing chat history or initialize empty array
      const chatHistoryKey = `chatHistory_${userId}`;
      const chatHistory = JSON.parse(localStorage.getItem(chatHistoryKey) || '[]');
      
      // Add new message to history
      chatHistory.push({
        text: message,
        isUser: isUser,
        timestamp: new Date().toISOString()
      });
      
      // Save updated history
      localStorage.setItem(chatHistoryKey, JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }
  
  // Function to load chat history from localStorage
  function loadChatHistory() {
    try {
      const chatHistoryKey = `chatHistory_${userId}`;
      const chatHistory = JSON.parse(localStorage.getItem(chatHistoryKey) || '[]');
      
      if (chatHistory.length > 0) {
        // Reposition page elements first
        repositionPage();
        
        // Show chat container if there's history
        chatContainer.classList.add('visible');
        
        // Display each message
        chatHistory.forEach(message => {
          const messageElement = document.createElement('div');
          messageElement.className = message.isUser ? 'user-messages' : 'chat-messages';
          chatMessagesContainer.appendChild(messageElement);
          
          // Display all messages immediately without animation
          messageElement.textContent = message.text;
        });
        
        // Scroll to bottom after loading all messages
        scrollToBottom();
        
        // Set textarea placeholder
        textarea.placeholder = "Reply to Healix...";
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }
  
  async function getAIResponse(message) {
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData._id || (userData.profile && userData.profile._id);
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Get sleep logs for today
      const sleepLogsKey = `healthai_sleepLogs_${userId}_${today}`;
      let sleepLogs = [];
      try {
        const todaySleepLogs = JSON.parse(localStorage.getItem(sleepLogsKey) || '[]');
        sleepLogs = todaySleepLogs.map(log => ({
          ...log,
          timestamp: new Date(log.date).getTime()
        }));
      } catch (error) {
        console.error('Error parsing sleep logs:', error);
      }
      
      // Get nutrition data from localStorage
      const userNutrition = JSON.parse(localStorage.getItem(`userNutrition_${userId}`) || '{}');
      const todayNutrition = userNutrition[today] || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        exerciseCalories: 0
      };

      // Get exercise data from localStorage
      const exerciseData = JSON.parse(localStorage.getItem('exerciseData') || '{}');

      // Get the mealData from localStorage to get accurate macro information
      const mealData = JSON.parse(localStorage.getItem('mealData') || '{}');
      const todayMealData = mealData[today];
      
      if (todayMealData) {
        // Update nutrition values from meal data
        todayNutrition.calories = todayMealData.totalCalories || todayNutrition.calories;
        todayNutrition.protein = todayMealData.totalProtein || todayNutrition.protein;
        todayNutrition.carbs = todayMealData.totalCarbs || todayNutrition.carbs;
        todayNutrition.fats = todayMealData.totalFats || todayNutrition.fats;
      }
      
      // Also check for dailyNutrition in localStorage
      const dailyNutritionData = localStorage.getItem('dailyNutrition');
      if (dailyNutritionData) {
        try {
          const parsedData = JSON.parse(dailyNutritionData);
          // Use the values from dailyNutrition if they're non-zero
          if (parsedData.protein > 0) todayNutrition.protein = parsedData.protein;
          if (parsedData.carbs > 0) todayNutrition.carbs = parsedData.carbs;
          if (parsedData.fats > 0) todayNutrition.fats = parsedData.fats;
          if (parsedData.calories > 0) todayNutrition.calories = parsedData.calories;
        } catch (error) {
          console.error('Error parsing dailyNutrition data:', error);
        }
      }

      // Get exercise calories
      const exerciseCalories = localStorage.getItem(`healthai_exercise_${userId}`) || '0';
      
      // Get the most up-to-date weight data from multiple sources
      let latestWeight = null;
      let latestWeightData = null;
      
      // First check the latest weight key (most reliable)
      const latestWeightKey = `healthai_latestWeight_${userId}`;
      const latestWeightObj = JSON.parse(localStorage.getItem(latestWeightKey) || '{}');
      if (latestWeightObj && latestWeightObj.weight) {
        latestWeight = latestWeightObj.weight.toString();
        latestWeightData = latestWeightObj;
        console.log(`Using latest weight from latestWeightKey: ${latestWeight}`);
      }
      
      // If not found, check the user data object
      if (!latestWeight) {
        const healthai_user_data = JSON.parse(localStorage.getItem('healthai_user_data') || '{}');
        if (healthai_user_data && healthai_user_data.currentWeight) {
          latestWeight = healthai_user_data.currentWeight.toString();
          console.log(`Using latest weight from healthai_user_data: ${latestWeight}`);
        }
      }
      
      // If still not found, use the global CURRENT_WEIGHT key
      if (!latestWeight) {
        latestWeight = localStorage.getItem('CURRENT_WEIGHT');
        console.log(`Using latest weight from CURRENT_WEIGHT: ${latestWeight}`);
      }
      
      // Get complete health data
      const healthData = JSON.parse(localStorage.getItem('healthai_health_data') || '{}');
      
      // Construct user data object with all necessary data
      const userDataForAI = {
        profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
        health: {
          ...healthData,
          weight: parseFloat(latestWeight) || healthData.weight, // Use latest weight if available
          goalWeight: parseFloat(localStorage.getItem('GOAL_WEIGHT')) || healthData.goalWeight
        },
        weights: JSON.parse(localStorage.getItem('userWeights') || '[]'),
        latestWeight: latestWeight,
        latestWeightData: latestWeightData,
        healthai_user_data: JSON.parse(localStorage.getItem('healthai_user_data') || '{}'),
        goalWeight: localStorage.getItem('GOAL_WEIGHT'),
        calorieGoal: localStorage.getItem('CALORIE_GOAL'),
        sleepLogs: sleepLogs,
        nutrition: {
          [today]: {
            calories: todayNutrition.calories,
            protein: todayNutrition.protein,
            carbs: todayNutrition.carbs,
            fats: todayNutrition.fats,
            exerciseCalories: exerciseCalories
          }
        },
        exerciseCalories: exerciseCalories,
        exerciseData: JSON.stringify(exerciseData)
      };
      
      console.log('Sending data to AI:', userDataForAI);
      
      // Send request to backend
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          userId,
          userData: userDataForAI
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
  }
  
  function performAction() {
    // Check if the button is already clicked (loading in progress)
    if(buttonClicked) {
      return; // Exit the function if already processing a message
    }
    
    if(textarea.value.trim() !== '') {
      repositionPage();
      searchBtn.classList.add('hidden');
      buttonClicked = true;
      
      // Get the user's message
      const userMessage = textarea.value.trim();
      
      // Clear the textarea
      textarea.value = '';
      
      autoResize();
      
      textarea.disabled = true;
      
      typeText(textarea, "Generating answers...", 80);
      
      loader.style.opacity = '0';
      loader.style.visibility = 'visible';
      
      // Wait for page repositioning to complete before showing the chat container
      setTimeout(() => {
        // Show the chat container if this is the first message
        if (!chatContainer.classList.contains('visible')) {
          chatContainer.classList.add('visible');
          
          // Add user message to the chat container after a short delay
          setTimeout(() => {
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'user-messages';
            chatMessagesContainer.appendChild(userMessageElement);
            
            // Animate the user message text
            animateMessageText(userMessageElement, userMessage, 30, () => {
              // Only after user message animation is complete, get AI response
              setTimeout(() => {
                loader.style.transition = 'opacity 0.4s ease-in-out';
        loader.style.opacity = '1';
        
                // Get AI response
                getAIResponse(userMessage).then(aiResponse => {
          loader.style.opacity = 0;
          
                  setTimeout(() => {
            loader.style.visibility = 'hidden';
            
                    // Add AI response to the chat container
                    const chatMessageElement = document.createElement('div');
                    chatMessageElement.className = 'chat-messages';
                    chatMessagesContainer.appendChild(chatMessageElement);
                    
                    // Save AI response to chat history
                    saveChatHistory(aiResponse, false);
                    
                    // Animate the AI response text
                    animateMessageText(chatMessageElement, aiResponse, 30, function() {
                      // After animation completes, enable the textarea
                      textarea.disabled = false;
                      textarea.placeholder = '';
                      typeText(textarea, "Reply to Healix...", 40, function() {
                        buttonClicked = false;
                      });
                    });
                    
                  }, 400);
                });
              }, 100);
            });
            
            // Save user message to chat history
            saveChatHistory(userMessage, true);
            
            // Scroll to the bottom after adding user message
            scrollToBottom();
          }, 300);
        } else {
          // If chat container is already visible, add the message immediately
          const userMessageElement = document.createElement('div');
          userMessageElement.className = 'user-messages';
          chatMessagesContainer.appendChild(userMessageElement);
          
          // Animate the user message text
          animateMessageText(userMessageElement, userMessage, 30, () => {
            // Only after user message animation is complete, get AI response
            setTimeout(() => {
              loader.style.transition = 'opacity 0.4s ease-in-out';
              loader.style.opacity = '1';
              
              // Get AI response
              getAIResponse(userMessage).then(aiResponse => {
                loader.style.opacity = 0;
                
                setTimeout(() => {
                  loader.style.visibility = 'hidden';
                  
                  // Add AI response to the chat container
                  const chatMessageElement = document.createElement('div');
                  chatMessageElement.className = 'chat-messages';
                  chatMessagesContainer.appendChild(chatMessageElement);
                  
                  // Save AI response to chat history
                  saveChatHistory(aiResponse, false);
                  
                  // Animate the AI response text
                  animateMessageText(chatMessageElement, aiResponse, 30, function() {
                    // After animation completes, enable the textarea
                    textarea.disabled = false;
                    textarea.placeholder = '';
                    typeText(textarea, "Reply to Healix...", 40, function() {
                      buttonClicked = false;
                    });
                  });
                  
                }, 400);
              });
      }, 100);
          });
          
          // Save user message to chat history
          saveChatHistory(userMessage, true);
          
          // Scroll to the bottom after adding user message
          scrollToBottom();
        }
      }, 550);
    }
  }
  
  searchBtn.addEventListener('click', performAction); //when the button is clicked, it will perform the function above
  
  textarea.addEventListener('keypress', function(event) { //checks the text area for when the enter key is clicked
    if (event.key === 'Enter' && !event.shiftKey) { //if enter key is clicked and not the shift key
      event.preventDefault(); //prevent default
      performAction(); //perform the function above
    }
  });

  function repositionPage() { //function to reposition the page
    const greeting = document.getElementById('chat-greeting'); //the greeting title
    const chatArea = document.querySelector('.chat'); //the container of textarea
    
    greeting.style.top = '5%'; //reposition to top
    greeting.style.fontSize = '1.4rem'; //change font size
    greeting.style.transition = 'all 400ms ease-out'; //add a transition as it moves up
    
    chatArea.style.top = '86%'; //moves the chat container down
    chatArea.style.transition = 'all 550ms ease-out'; //also add transition
  }
  
  setTimeout(autoResize, 0);
  
  // Load chat history when page loads
  loadChatHistory();

  // Add reset chat functionality
  const resetChatBtn = document.getElementById('reset-chat');
  if (resetChatBtn) {
    resetChatBtn.addEventListener('click', function() {
      // Clear chat history from localStorage
      const chatHistoryKey = `chatHistory_${userId}`;
      localStorage.removeItem(chatHistoryKey);
      
      // Clear chat messages from UI
      const chatMessagesContainer = document.getElementById('chat-messages-container');
      if (chatMessagesContainer) {
        chatMessagesContainer.innerHTML = '';
      }
      
      // Hide chat container
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.classList.remove('visible');
      }
      
      // Reset page layout
      const greeting = document.getElementById('chat-greeting');
      const chatArea = document.querySelector('.chat');
      
      if (greeting && chatArea) {
        greeting.style.top = '30%';
        greeting.style.fontSize = '3.4rem';
        chatArea.style.top = '50%';
      }
      
      // Reset textarea
      const textarea = document.getElementById('chat-text');
      if (textarea) {
        textarea.value = '';
        textarea.placeholder = 'How can Healix help you?';
        textarea.disabled = false;
      }
    });
  }
});