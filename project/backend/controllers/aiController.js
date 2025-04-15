const OpenAI = require("openai");
require('dotenv').config();

//Get OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_APIKEY;

//Debug logging
console.log('Environment variables loaded');
console.log('API Key status:', OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('API Key length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);
console.log('First 4 chars of API key:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 4) : 'none');

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key is missing. Please check your .env file');
  throw new Error('OpenAI API key is required');
}

//Initialize OpenAI client with error handling
let openai;
try {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
  console.log('OpenAI client initialized successfully');
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
  throw error;
}

//Function to detect if message is a greeting
function isGreeting(message) {
  const greetingPatterns = [
    /\b(hi|hello|hey|howdy|hiya|greetings|yo|sup|what's up|how are you|good morning|good afternoon|good evening)\b/i
  ];
  
  return greetingPatterns.some(pattern => pattern.test(message));
}

//Function to check if Healix is directly addressed
function addressesHealix(message) {
  return /\b(healix|helix|health ai|healthai)\b/i.test(message);
}

//Function to determine if message is likely a question
function isQuestion(message) {
  //Check for question marks
  if (message.includes('?')) return true;
  
  //Check for question words
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'is', 'are', 'do', 'does'];
  return questionWords.some(word => message.toLowerCase().split(' ').includes(word));
}

//Function to calculate calorie needs using the Mifflin-St Jeor Equation
function calculateCalorieNeeds(healthData) {
  if (!healthData || !healthData.age || !healthData.height || !healthData.weight || !healthData.gender || !healthData.activityLevel) {
    console.log('Cannot calculate calories - missing required health data');
    return null;
  }

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

  //Calculate calorie goals based on weekly goal
  const weeklyGoal = (healthData.weeklyGoal || '').toLowerCase();
  let calorieGoal = Math.round(tdee); //Default to maintenance

  if (weeklyGoal.includes('lose')) {
    if (weeklyGoal.includes('0.5')) {
      calorieGoal = Math.round(tdee - 250);
    } else if (weeklyGoal.includes('1')) {
      calorieGoal = Math.round(tdee - 500);
    }
  } else if (weeklyGoal.includes('gain')) {
    if (weeklyGoal.includes('0.5')) {
      calorieGoal = Math.round(tdee + 250);
    } else if (weeklyGoal.includes('1')) {
      calorieGoal = Math.round(tdee + 500);
    }
  }

  return calorieGoal;
}

/**
 * Process user data from the request
 * @param {Object} userData - The user data from the request
 * @returns {Object} Processed user data object
 */
function processUserData(userData) {
  try {
    if (!userData) {
      return {};
    }

    //Initialize processedData object
    const processedData = {};

    //Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    //Process nutrition data
    const nutritionData = userData.nutrition || {};
    const todayNutrition = nutritionData[today] || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      exerciseCalories: 0
    };

    //Get the most recent health data
    let healthData = {};
    let mostRecentTimestamp = 0;

    //Check health data from user_data object first (most recent)
    if (userData.healthai_user_data && userData.healthai_user_data.health) {
      const userDataHealth = userData.healthai_user_data.health;
      if (userDataHealth.lastUpdated) {
        const timestamp = new Date(userDataHealth.lastUpdated).getTime();
        if (timestamp > mostRecentTimestamp) {
          healthData = { ...userDataHealth };
          mostRecentTimestamp = timestamp;
        }
      }
    }

    //If no recent health data found, use the provided health data
    if (Object.keys(healthData).length === 0) {
      healthData = userData.health || {};
    }

    //Get latest weight from the most recent source
    let latestWeight = null;
    let latestWeightTimestamp = 0;

    //Check healthai_user_data.health first (most reliable source)
    if (userData.healthai_user_data && userData.healthai_user_data.health && userData.healthai_user_data.health.weight) {
      latestWeight = parseFloat(userData.healthai_user_data.health.weight);
      if (userData.healthai_user_data.health.lastUpdated) {
        latestWeightTimestamp = new Date(userData.healthai_user_data.health.lastUpdated).getTime();
      }
    }

    //Check latestWeightData if it's more recent
    if (userData.latestWeightData && userData.latestWeightData.weight && userData.latestWeightData.timestamp > latestWeightTimestamp) {
      latestWeight = parseFloat(userData.latestWeightData.weight);
      latestWeightTimestamp = userData.latestWeightData.timestamp;
    }

    //Update health data with the most recent weight
    if (latestWeight) {
      healthData.weight = latestWeight;
    }

    //Get the most recent goal weight
    let goalWeight = null;
    if (userData.healthai_user_data && userData.healthai_user_data.health && userData.healthai_user_data.health.goalWeight) {
      goalWeight = parseFloat(userData.healthai_user_data.health.goalWeight);
    } else if (userData.goalWeight) {
      goalWeight = parseFloat(userData.goalWeight);
    }

    //Update health data with goal weight
    if (goalWeight) {
      healthData.goalWeight = goalWeight;
    }
    
    //Calculate calorie goal based on most recent health data
    let calorieGoal = null;
    if (healthData && Object.keys(healthData).length > 0) {
      calorieGoal = calculateCalorieNeeds(healthData);
    } else {
      calorieGoal = userData.calorieGoal ? parseInt(userData.calorieGoal) : null;
    }

    //Process weights array
    let weights = [];
    if (Array.isArray(userData.weights)) {
      weights = userData.weights.map(w => {
        if (w && typeof w === 'object') {
          return {
            ...w,
            weight: w.weight ? parseFloat(w.weight) : null,
            date: w.date || null
          };
        }
        return null;
      }).filter(w => w !== null);
    }

    //Process exercise data
    let exerciseHistory = [];
    try {
      const exerciseData = JSON.parse(userData.exerciseData || '{}');
      if (exerciseData[today] && exerciseData[today].exercises) {
        exerciseHistory = exerciseData[today].exercises.map(exercise => ({
          name: exercise.name,
          category: exercise.category,
          calories: exercise.calories
        }));
      }
    } catch (error) {
      console.error('Error processing exercise data:', error);
    }

    //Process exercise calories
    if (userData.exerciseCalories) {
      processedData.exerciseCalories = userData.exerciseCalories;
    } else {
      processedData.exerciseCalories = 0;
    }

    //Get sleep history from the passed userData
    let sleepHistory = [];
    try {
      //Get sleep logs from the passed userData
      if (userData.sleepLogs && Array.isArray(userData.sleepLogs)) {
        sleepHistory = userData.sleepLogs.map(log => ({
          date: log.date,
          hours: parseInt(log.hours) || 0,
          minutes: parseInt(log.minutes) || 0,
          totalMinutes: (parseInt(log.hours) || 0) * 60 + (parseInt(log.minutes) || 0),
          text: log.text,
          timestamp: log.timestamp || new Date(log.date).getTime()
        })).sort((a, b) => b.timestamp - a.timestamp); //Sort by timestamp, most recent first
      }

      //Add sleep data to health data
      if (healthData) {
        healthData.sleepLogs = sleepHistory;
        if (sleepHistory.length > 0) {
          healthData.todaySleep = sleepHistory[0];
        }
      }
    } catch (error) {
      console.error('Error processing sleep data:', error);
    }

    //Get today's sleep data
    const todaySleep = sleepHistory.find(log => log.date === today) || (sleepHistory.length > 0 ? sleepHistory[0] : null);

    //Get BMI
    const bmi = healthData.bmi || null;

    return {
      profile: userData.profile || {},
      health: healthData,
      weights: weights,
      latestWeight: latestWeight,
      goalWeight: goalWeight,
      calorieGoal: calorieGoal,
      bmi: bmi,
      nutrition: {
        today: todayNutrition,
        history: nutritionData
      },
      exerciseCalories: processedData.exerciseCalories,
      exerciseHistory: exerciseHistory,
      sleep: {
        today: todaySleep || null,
        history: sleepHistory
      }
    };
  } catch (error) {
    console.error('Error processing user data:', error);
    return {};
  }
}

/**
 * @desc    Get AI response for user query
 * @route   POST /api/ai/chat
 * @access  Public
 */
const getAIResponse = async (req, res) => {
  try {
    const { message, userId, userData } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!openai) {
      return res.status(500).json({ 
        message: 'OpenAI client not initialized',
        error: 'Configuration error'
      });
    }
    
    //Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    //Process user data for personalized responses
    const processedUserData = processUserData(userData);
    
    let userContext = '';
    
    //Create a context string with user data
    if (processedUserData.latestWeight !== null && processedUserData.latestWeight !== undefined) {
      userContext += `Current weight: ${processedUserData.latestWeight} lbs. `;
    }
    
    if (processedUserData.goalWeight !== null && processedUserData.goalWeight !== undefined) {
      userContext += `Goal weight: ${processedUserData.goalWeight} lbs. `;
    }
    
    if (processedUserData.calorieGoal !== null && processedUserData.calorieGoal !== undefined) {
      userContext += `Daily calorie goal: ${processedUserData.calorieGoal} calories. `;
    }
    
    if (processedUserData.nutrition && processedUserData.nutrition.today) {
      const today = processedUserData.nutrition.today;
      userContext += `Today's nutrition: ${today.calories} calories, ${today.protein}g protein, ${today.carbs}g carbs, ${today.fats}g fats. `;
    }
    
    if (processedUserData.exerciseCalories !== null && processedUserData.exerciseCalories !== undefined) {
      userContext += `Exercise calories burned today: ${processedUserData.exerciseCalories}. `;
    }

    //Add exercise history to context
    if (processedUserData.exerciseHistory && processedUserData.exerciseHistory.length > 0) {
      userContext += `Today's exercises: `;
      processedUserData.exerciseHistory.forEach((exercise, index) => {
        userContext += `${exercise.name} (${exercise.category}) - ${exercise.calories} calories`;
        if (index < processedUserData.exerciseHistory.length - 1) {
          userContext += ', ';
        }
      });
      userContext += '. ';
    }
    
    if (processedUserData.health) {
      if (processedUserData.health.age) userContext += `Age: ${processedUserData.health.age}. `;
      if (processedUserData.health.height) userContext += `Height: ${processedUserData.health.height} inches. `;
      if (processedUserData.health.gender) userContext += `Gender: ${processedUserData.health.gender}. `;
      if (processedUserData.health.activityLevel) userContext += `Activity level: ${processedUserData.health.activityLevel}. `;
    }

    //Add BMI to context
    if (processedUserData.bmi !== null && processedUserData.bmi !== undefined) {
      userContext += `BMI: ${processedUserData.bmi}. `;
    }

    //Add sleep data to context
    if (processedUserData.health && processedUserData.health.todaySleep) {
      const todaySleep = processedUserData.health.todaySleep;
      userContext += `Today's sleep: ${todaySleep.hours} hours and ${todaySleep.minutes} minutes. `;
    } else if (processedUserData.sleep && processedUserData.sleep.today) {
      const todaySleep = processedUserData.sleep.today;
      userContext += `Today's sleep: ${todaySleep.hours} hours and ${todaySleep.minutes} minutes. `;
    }

    //Add recent sleep history if available
    if (processedUserData.health && processedUserData.health.sleepLogs && processedUserData.health.sleepLogs.length > 0) {
      const recentSleep = processedUserData.health.sleepLogs[0];
      if (recentSleep.date !== today) {
        userContext += `Last recorded sleep (${recentSleep.date}): ${recentSleep.hours} hours and ${recentSleep.minutes} minutes. `;
      }
    } else if (processedUserData.sleep && processedUserData.sleep.history && processedUserData.sleep.history.length > 0) {
      const recentSleep = processedUserData.sleep.history[0];
      if (recentSleep.date !== today) {
        userContext += `Last recorded sleep (${recentSleep.date}): ${recentSleep.hours} hours and ${recentSleep.minutes} minutes. `;
      }
    }

    //Check if the user addressed Healix by name
    const mentionsHealix = addressesHealix(message);
    
    let systemPrompt = "";
    
    //Handle greetings differently than questions
    if (isGreeting(message) && !isQuestion(message)) {
      systemPrompt = `
        You are Healix, a sarcastic but friendly AI health assistant. 
        The user is greeting you${mentionsHealix ? ' and has addressed you by name' : ''}.
        Respond with a brief, witty greeting that acknowledges your name is Healix.
        Keep it under 15 words. Be sarcastic but welcoming.
        
        User context: ${userContext}
      `;
    } else {
      systemPrompt = `
        You are Healix, a sarcastic but helpful AI health assistant.
        Your name is Healix, and you should always be aware of this when responding.
        ${mentionsHealix ? 'The user has directly addressed you by name, so acknowledge this in your response.' : ''}
        
        RESPONSE GUIDELINES:
        - Keep responses extremely brief (25-50 words maximum)
        - Start with a short sarcastic comment (1 sentence max)
        - Follow with concise, factually accurate information
        - Focus on providing practical, actionable advice
        - Frame all responses in a health/fitness context
        - Use simple, direct language with no fluff
        
        Your entire response should fit in 2-3 short sentences. 
        Prioritize being informative and accurate over being funny.
        
        IMPORTANT: Use the user's actual data in your responses. If the user asks about their weight, calories, or other health metrics, use the exact values provided in the user context.
        
        User context: ${userContext}
        Use this information to provide personalized advice when relevant to the user's question.
      `;
    }
    
    //Call OpenAI API using the SDK
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150,  //Reduced token count for shorter responses
      temperature: 0.7
    });
    
    //Extract the AI response from the API response
    const aiResponse = response.choices[0].message.content;
    
    res.status(200).json({
      message: 'AI response retrieved successfully',
      response: aiResponse
    });
  } catch (error) {
    console.error('Error in getAIResponse:', error);
    
    // Handle specific API key errors
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        message: 'API key configuration error',
        error: 'Invalid API key'
      });
    }
    
    // Handle other OpenAI-specific errors
    if (error.response) {
      return res.status(error.response.status || 500).json({
        message: 'OpenAI API error',
        error: error.response.data
      });
    }
    
    // Handle general errors
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAIResponse
};