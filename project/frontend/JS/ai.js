document.addEventListener('DOMContentLoaded', function() { //load all elements on the page
  const textarea = document.getElementById('chat-text'); //grabs the textarea where user write prompts to chat
  const searchBtn = document.getElementById('search'); //searchbtn to send the prompt to chat and get response
  const loader = document.querySelector('.loader'); //loading when processing prompts
  
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
  
  function performAction() { //perform several actions in this function
    if(!buttonClicked && textarea.value.trim() !== '') { //if the button clicked is not false and the value of the text area is not empty 
      repositionPage(); //this will reposition the page by calling the function
      searchBtn.classList.add('hidden'); //then the searchbtn will be hidden
      buttonClicked = true; //and will now set the button clicked to be true 
      
      textarea.value = ''; //once btn search is clicked, the value inside the textarea is empty 
      
      autoResize(); //resize the textarea
      
      textarea.disabled = true; //disable the textarea while the animation is loading 
      
      typeText(textarea, "Generating answers...", 80); //typing animation for this placeholder 
      
      loader.style.opacity = '0'; //set the loader to be hidden at first
      loader.style.visibility = 'visible';
      
      setTimeout(() => { //time intervals for the animations and loading
        loader.style.transition = 'opacity 0.4s ease-in-out'; //now the loader is visible with a transition
        loader.style.opacity = '1';
        
        setTimeout(() => { //another time interval to slowly fade out the loader after a certain time
          loader.style.opacity = 0;
          
          setTimeout(() => { //another time interval to completely hide the loader 
            loader.style.visibility = 'hidden';
            
            textarea.disabled = false; //enable the text area to type again 
            
            textarea.placeholder = ''; //reset the placeholder to be empty 
            
            typeText(textarea, "Reply to Healix...", 40, function() { //another text animation for a new palceholder
              buttonClicked = false; //now the searchbtn clicked is false and now will be able to search again
            });
            
          }, 400); //speed for time intervals 
        }, 4000);
      }, 100);
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
});