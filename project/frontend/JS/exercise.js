document.addEventListener('DOMContentLoaded', function() {
  //===== DOM ELEMENTS =====
  //Date navigation elements
  const yesterdayBtn = document.getElementById('leftdatebtnexercise');
  const tomorrowBtn = document.getElementById('rightdatebtnexercise');
  const dateSpan = document.getElementById('datespanexercise');

  //Exercise logging elements
  const addExerciseBtn = document.getElementById('addexercisebtn');
  const logContainer = document.querySelector('.exerciselog-container');
  const totalCaloriesSpan = document.getElementById('calorieburnexercisepage');
  
  //Milestone elements
  const milestoneInput = document.getElementById('milestonecalorievalue');
  const milestoneButton = document.getElementById('milestonebtn');
  const progressPercentage = document.getElementById('progress-percentage');
  const progressRemainingCalories = document.getElementById('progress-remaining-calories');
  const progressBar = document.querySelector('.progress-bar');

  //Exercise selection containers
  const chooseExerciseContainer = document.querySelector('.choose-exercise-container');
  const searchExerciseDiv = document.getElementById('searchExerciseDiv');
  const closeExerciseBtn = document.getElementById('closeExerciseBtn');

  //Category elements
  const cardioCategory = document.getElementById('cardioCategory');
  const gymCategory = document.getElementById('gymCategory');
  const outdoorCategory = document.getElementById('outdoorCategory');
  const sportsCategory = document.getElementById('sportsCategory');

  //Selection elements
  const cardioSelection = document.getElementById('cardioSelection');
  const gymSelection = document.getElementById('gymSelection');
  const sportSelection = document.getElementById('sportSelection');
  const outdoorSelection = document.getElementById('outdoorSelection');

  //Exercise diary elements
  const addToDiary = document.querySelector('.addexercisetodiary');

  //Exercise search elements
  const exerciseSearchInput = document.getElementById('exercise-search');
  const searchExerciseBtn = document.getElementById('searchexercisebtn');
  const exerciseList = document.querySelector('.exercise-list');
  const exerciseLink = document.querySelector('.exercise-link a');
  const exerciseInputBox = document.getElementById('exercise-input-box');
  const searchBtn = document.getElementById('searchbtn');
  const exerciseSuggestions = document.getElementById('exercisesuggestions');
  const exerciseNameSpan = document.querySelector('.exercisename');
  const calorieListNumber = document.getElementById('calorie-list-number');

  //Create overlay div
  const overlayDiv = document.createElement('div');
  overlayDiv.className = 'page-overlay';
  document.body.appendChild(overlayDiv);

  //===== STATE VARIABLES =====
  let exerciseCount = 0;
  let totalCalories = 0;
  let calorieGoal = 0;
  let milestoneSet = false;
  let goalAchieved = false;
  let selectedCategory = '';
  let exercises = [];
  let selectedExercise = null;

  //Date variables
  let currentDate = new Date();
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  
  //===== EMBEDDED EXERCISE DATA =====
  const exerciseData = {
    "exercises": [
      {
        "name": "Jumping Jacks",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=dGRoJ0vKIls"
      },
      {
        "name": "Burpees",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=auBLPXO8Fww"
      },
      {
        "name": "Mountain Climbers",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=ruQ4ZwncXBg"
      },
      {
        "name": "Jump Squats",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=5xv0DKqe5XQ"
      },
      {
        "name": "High Knees",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=0X0Q8wKLEfo"
      },
      {
        "name": "Treadmill sprints",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=gC-eX9k2DIw"
      },
      {
        "name": "Stationary Bike Intervals",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=Rh8VswzWDow"
      },
      {
        "name": "Rowing Machine",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=bCxq4zMHpzs"
      },
      {
        "name": "Stairmaster",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=LM9lgFK4mkk"
      },
      {
        "name": "Elliptical Sprints",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=xDzXCpDmqhM"
      },
      {
        "name": "Running",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=A5uZobDo80Q"
      },
      {
        "name": "Jump Rope",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=u3zgHI8QnqE"
      },
      {
        "name": "Hiking",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=Y8NTPw0iMGU"
      },
      {
        "name": "Cycling",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=ZAXXJdTkWkY"
      },
      {
        "name": "Swimming",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=pFN2n7CRqhw"
      },
      {
        "name": "Dance",
        "category": "Cardio",
        "type": "Cardio",
        "link": ""
      },
      {
        "name": "Hula Hooping",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=zWPJd1y9Vcs"
      },
      {
        "name": "Incline Walking",
        "category": "Cardio",
        "type": "Cardio",
        "link": "https://www.youtube.com/watch?v=eT0Ac6VaCIk"
      },
      {
        "name": "Barbell Bench Press",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=hWbUlkb5Ms4"
      },
      {
        "name": "Incline Dumbbell Press",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=5CECBjd7HLQ"
      },
      {
        "name": "Decline Barbell Press",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=nJkNpDDsTFk"
      },
      {
        "name": "Chest Fly's",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=rk8YayRoTRQ"
      },
      {
        "name": "Push-Ups",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=yQEx9OC2C3E"
      },
      {
        "name": "Chest Dips",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=yQEx9OC2C3E"
      },
      {
        "name": "Cable Chest Press",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=NXpRKhXg2P8"
      },
      {
        "name": "Landmine Chest Press",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=N4UpzIcBe34"
      },
      {
        "name": "Medicine Ball Push-ups",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=-cqo-oailwk"
      },
      {
        "name": "Smith Machine Bench Press",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=E4G-M8Vvzps"
      },
      {
        "name": "Overhead Barbell Press",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=zoN5EH50Dro"
      },
      {
        "name": "Lateral Raises",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=Kl3LEzQ5Zqs"
      },
      {
        "name": "Arnold Press",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=6K_N9AGhItQ"
      },
      {
        "name": "Front Raises",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=yHx8wPv4RPo"
      },
      {
        "name": "Shrugs",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=kG4qXCYvITg"
      },
      {
        "name": "Pull-Ups",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=eDP_OOhMTZ4"
      },
      {
        "name": "Barbell Rows",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=Nqh7q3zDCoQ"
      },
      {
        "name": "Lat Pulldowns",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=bNmvKpJSWKM"
      },
      {
        "name": "Seated Cable Rows",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=qD1WZ5pSuvk"
      },
      {
        "name": "Dumbbell Rows",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=WkFX6_GxAs8"
      },
      {
        "name": "Barbell Bicep Curls",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=54x2WF1_Suc"
      },
      {
        "name": "Hammer Curls",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=VuEclXR7sZY"
      },
      {
        "name": "Concentration Curls",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=I_bKCYL2nL8"
      },
      {
        "name": "Preacher Curls",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=0y4tdUNPdlE"
      },
      {
        "name": "Cable Bicep Curls",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=CrbTqNOlFgE"
      },
      {
        "name": "Tricep Dips",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=cFK5G2Exwwo"
      },
      {
        "name": "Skull Crushers",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=zR9gty7LUxE"
      },
      {
        "name": "Tricep Pushdowns",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=Rc7-euA8FDI"
      },
      {
        "name": "Overhead Dumbbell Tricep Extensions",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=b_r_LW4HEcM"
      },
      {
        "name": "Tricep Kickbacks",
        "category": "Gym",
        "type": "Upper Body",
        "link": "https://www.youtube.com/watch?v=GZ3NzlJs_yg"
      },
      {
        "name": "Barbell Squats",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=Ak1iHbEeeY8"
      },
      {
        "name": "Leg Press",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=EotSw18oR9w"
      },
      {
        "name": "Bulgarian Split Squats",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=or1frhkjBDc"
      },
      {
        "name": "Walking Lunges",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=DlhojghkaQ0"
      },
      {
        "name": "Goblet Squats",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=lRYBbchqxtI"
      },
      {
        "name": "Romanian Deadlifts",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=5rIqP63yWFg"
      },
      {
        "name": "Hamstring Curls",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=S2-lUYYyXgM"
      },
      {
        "name": "Glute-Ham Raises",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=gK5MIYPDfoQ"
      },
      {
        "name": "Kettlebell Swings",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=RyPgfIvNvN0"
      },
      {
        "name": "Stiff-Legged Deadlifts",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=Wou9zVQrAfs"
      },
      {
        "name": "Hip Thrusts",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=96uDbymTaHM"
      },
      {
        "name": "Glute Bridges",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=ysWdBc1a1FA"
      },
      {
        "name": "Lunges",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=1mHlkUC5rGY"
      },
      {
        "name": "Sumo Deadlifts",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=e7oLkRlT2CQ"
      },
      {
        "name": "Standing Calf Raises",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=fOfPwmb5FXU"
      },
      {
        "name": "Seated Calf Raises",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=ar8nav0jGoE"
      },
      {
        "name": "Donkey Calf Raises",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=FtD0qv9P7O0"
      },
      {
        "name": "Leg Press Calf Raises",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=dhRz1Ns60Zg"
      },
      {
        "name": "Single-Leg Calf Raises",
        "category": "Gym",
        "type": "Lower Body",
        "link": "https://www.youtube.com/watch?v=qPd73snQfUs"
      },
      {
        "name": "Crunches",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=eeJ_CYqSoT4"
      },
      {
        "name": "Leg Raises",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=5uB0KaoCF9w"
      },
      {
        "name": "Russian Twists",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=-BzNffL_6YE"
      },
      {
        "name": "V-Ups",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=iP2fjvG0g3w"
      },
      {
        "name": "Mountain Climbers",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=ruQ4ZwncXBg"
      },
      {
        "name": "Side Planks",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=sKMD_pbNm7w"
      },
      {
        "name": "Dumbbell Side Bend",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=kqr_IjiUuyY"
      },
      {
        "name": "Cable Woodchoppers",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=YIU0U_B57rU"
      },
      {
        "name": "Side Crunches",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=q0QyCrpiNgI"
      },
      {
        "name": "Hanging Leg Raises",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=2n4UqRIJyk4"
      },
      {
        "name": "Flutter Kicks",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=tPmybsDX8ZY"
      },
      {
        "name": "Reverse Crunches",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=N5CHqtgiylc"
      },
      {
        "name": "Plank to Knee Tucks",
        "category": "Gym",
        "type": "Core",
        "link": "https://www.youtube.com/watch?v=LyRBm9Rc5K8"
      },
      {
        "name": "Scissor Kicks",
        "category": "Gym",
        "type": "Core",
        "link": "https://youtu.be/WoNCIBVLbgY?t=12"
      },
      {
        "name": "Basketball",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=XIHqHouUHoY"
      },
      {
        "name": "Soccer",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=cpIwMZ3cUEc"
      },
      {
        "name": "Football",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=4yqDtnakFxs"
      },
      {
        "name": "Volleyball",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=o7nZ8TIhHQM&t=55s"
      },
      {
        "name": "Baseball",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=57mc7Df7Arw"
      },
      {
        "name": "Softball",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=YLU6W6AYQto"
      },
      {
        "name": "Hockey",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=H_70vAiyyXM"
      },
      {
        "name": "Rugby",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=keHYLxeQaLU"
      },
      {
        "name": "Lacrosse",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=VBIuo2EEkcg"
      },
      {
        "name": "Cricket",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=yXIJcKpFlV4"
      },
      {
        "name": "Dodgeball",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=rpnZvh8ginY"
      },
      {
        "name": "Tennis",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=jrhM3k84YJU"
      },
      {
        "name": "Golf",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=CN3ThL8DgFM"
      },
      {
        "name": "Boxing",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=jhcIjFgz2bI"
      },
      {
        "name": "Wrestling",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=fEELO-SXAsU"
      },
      {
        "name": "Gymnastics",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=1dzgl-D9EyU"
      },
      {
        "name": "Archery",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=7HGIASAOoa0"
      },
      {
        "name": "Track and Field",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=G-gG7DoLe00"
      },
      {
        "name": "Swimming",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=pFN2n7CRqhw"
      },
      {
        "name": "Martial Arts",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=C3TbxWTxVqg"
      },
      {
        "name": "Fencing",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=a8IdfA5fXJs"
      },
      {
        "name": "Weightlifting",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=ylzAXlDifu0"
      },
      {
        "name": "Bowling",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=xah1Cp9GA90"
      },
      {
        "name": "Table Tennis",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=k-MzcgTA-Mw"
      },
      {
        "name": "Surfing",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=67QNw2xQlsk"
      },
      {
        "name": "Snowboarding",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=7VBalG0IhhI"
      },
      {
        "name": "Marathons",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=lOuZ5iavrhs"
      },
      {
        "name": "Rowing",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=I9r6bXOvepU"
      },
      {
        "name": "Cross-Country Skiing",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=SuKn-acPvVk"
      },
      {
        "name": "Badminton",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=bJuiT6xzPuI"
      },
      {
        "name": "Pickleball",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=rD1O3R9B0Sw"
      },
      {
        "name": "Horseshoes",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=IsALhFAXNYY"
      },
      {
        "name": "Kickboxing",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=L3Fux_50Cyk"
      },
      {
        "name": "Muay Thai",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=uFJSSYECov4"
      },
      {
        "name": "MMA",
        "category": "Sports",
        "type": "Sports",
        "link": "https://www.youtube.com/watch?v=DIPL-IHldog&t=714s"
      },
      {
        "name": "Hiking",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=Y8NTPw0iMGU"
      },
      {
        "name": "Trail Running",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=l9K1nx7_FH8"
      },
      {
        "name": "Cycling",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=ZAXXJdTkWkY"
      },
      {
        "name": "Running",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=A5uZobDo80Q"
      },
      {
        "name": "Skateboarding",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=KTJnEIipufg"
      },
      {
        "name": "Rock climbing",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=S-4XZgARAuA"
      },
      {
        "name": "Kayaking",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=TAEkR13ChPs"
      },
      {
        "name": "Canoeing",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=dVUNzKkBE5o"
      },
      {
        "name": "Swimming",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=pFN2n7CRqhw"
      },
      {
        "name": "Rollerblading",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=SxraTJyE5OI"
      },
      {
        "name": "Parkour",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=HmqPX4w2AvA"
      },
      {
        "name": "Fishing",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=s1JZ5zCl1A0"
      },
      {
        "name": "Caving",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=KhvMGjHShlQ"
      },
      {
        "name": "Basketball",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=XIHqHouUHoY"
      },
      {
        "name": "Soccer",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=cpIwMZ3cUEc"
      },
      {
        "name": "Volleyball",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=o7nZ8TIhHQM&t=55s"
      },
      {
        "name": "Badminton",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=bJuiT6xzPuI"
      },
      {
        "name": "Pickleball",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=rD1O3R9B0Sw"
      },
      {
        "name": "Ultimate Frisbee",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=QQCY6qrBey0"
      },
      {
        "name": "Flag Football",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=Ck-VxQObXBI"
      },
      {
        "name": "Capture the Flag",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=AwQKf5Mn5Zc"
      },
      {
        "name": "Paintball",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=Pan4htMS_lA"
      },
      {
        "name": "Golf",
        "category": "Outdoor",
        "type": "Outdoor",
        "link": "https://www.youtube.com/watch?v=CN3ThL8DgFM"
      }
    ]
  };

  //===== CORE FUNCTIONS =====
  
  //Display exercise results in the UI
  function displayExerciseResults(exercises) {
    const exerciseList = document.querySelector('.exercise-list');
    if (!exerciseList) {
      console.error('Exercise list element not found');
      return;
    }
    
    //Clear the existing content
    exerciseList.innerHTML = '';

    if (exercises.length === 0) {
      exerciseList.innerHTML = '<p>No exercises found</p>';
      return;
    }

    //Group exercises by category
    const exercisesByCategory = {
      'Cardio': exercises.filter(ex => ex.category === 'Cardio'),
      'Gym': exercises.filter(ex => ex.category === 'Gym'),
      'Sports': exercises.filter(ex => ex.category === 'Sports'),
      'Outdoor': exercises.filter(ex => ex.category === 'Outdoor')
    };

    //Create alternating list of exercises
    const sortedExercises = [];
    const categories = ['Cardio', 'Gym', 'Sports', 'Outdoor'];
    
    //Find the maximum length of any category
    const maxLength = Math.max(...categories.map(cat => exercisesByCategory[cat].length));
    
    //Alternate between categories
    for (let i = 0; i < maxLength; i++) {
      for (const category of categories) {
        if (exercisesByCategory[category][i]) {
          sortedExercises.push(exercisesByCategory[category][i]);
        }
      }
    }

    //Display exercises
    sortedExercises.forEach(exercise => {
      //Determine icon based on category
      let iconClass = '';
      let iconColor = '';
      if (exercise.category === 'Cardio') {
        iconClass = 'bx-run';
        iconColor = 'color: rgb(255, 221, 0);'; //Yellow color for Cardio
      } else if (exercise.category === 'Gym') {
        iconClass = 'bx-dumbbell';
        iconColor = 'color: rgb(54, 162, 235);'; //Blue color for Gym
      } else if (exercise.category === 'Sports') {
        iconClass = 'bxs-basketball bx-rotate-270';
        iconColor = 'color: rgb(247, 111, 0);'; //Orange color for Sports
      } else if (exercise.category === 'Outdoor') {
        iconClass = 'bxs-tree-alt';
        iconColor = 'color: rgb(4, 148, 23);'; //Green color for Outdoor
      }
      
      const exerciseItem = document.createElement('div');
      exerciseItem.className = 'exercise-item';
      exerciseItem.innerHTML = `
        <div class="left">
          <i class='bx ${iconClass} exercise-icon' id="exercise-icon" style="${iconColor}"></i>
          <h1 id="workout-name">${exercise.name}</h1>
        </div>
        <div class="right">
          <h1 id="workout-category">${exercise.category}</h1>
        </div>
      `;
      
      //Add click event to select this exercise
      exerciseItem.addEventListener('click', () => {
        selectExercise(exercise, exerciseItem);
      });
      
      exerciseList.appendChild(exerciseItem);
    });
    
    //Set initial YouTube link to "#" to prevent page reloading
    const exerciseLink = document.querySelector('.exercise-link a');
    if (exerciseLink) {
      exerciseLink.href = "#";
      exerciseLink.textContent = "Watch Tutorial";
      
      //Add event listener to prevent default behavior
      exerciseLink.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
  }

  //Select an exercise for the diary
  function selectExercise(exercise, clickedElement) {
    selectedExercise = exercise;
    selectedCategory = exercise.category;
    
    //Update UI to show selected exercise
    exerciseNameSpan.textContent = exercise.name;
    
    //Set active selection based on category
    setActiveSelectionByCategory(exercise.category);
    
    //Calculate estimated calories based on duration and intensity
    calculateCaloriesBurned();
    
    //Update the YouTube link
    const exerciseLink = document.querySelector('.exercise-link a');
    if (exerciseLink && exercise.link) {
      exerciseLink.href = exercise.link;
      exerciseLink.textContent = "Watch Tutorial";
      
      //Remove any existing event listeners
      const newLink = exerciseLink.cloneNode(true);
      exerciseLink.parentNode.replaceChild(newLink, exerciseLink);
    }
    
    //Reset all exercise items to default styling
    const allExerciseItems = document.querySelectorAll('.exercise-item');
    allExerciseItems.forEach(item => {
      item.style.backgroundColor = '';
      item.querySelector('#workout-name').style.color = '';
      item.querySelector('#workout-category').style.color = '';
    });
    
    //Apply selected styling to the clicked item
    if (clickedElement) {
      clickedElement.style.backgroundColor = 'black';
      clickedElement.querySelector('#workout-name').style.color = 'white';
      clickedElement.querySelector('#workout-category').style.color = 'white';
    }
  }

  //Initialize search functionality
  function initializeExerciseSearch() {
    console.log('Initializing exercise search...');
    
    const searchInput = document.getElementById('exercise-search');
    const searchButton = document.getElementById('searchexercisebtn');
    
    if (!searchInput || !searchButton) {
      console.error('Search elements not found');
      return;
    }
    
    console.log('Search elements found, setting up event listeners');
    
    //Display initial exercises
    displayExerciseResults(exerciseData.exercises);
    
    //Add event listener for real-time search
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const results = exerciseData.exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm) ||
        exercise.category.toLowerCase().includes(searchTerm) ||
        exercise.type.toLowerCase().includes(searchTerm)
      );
      displayExerciseResults(results);
    });
    
    //Add event listener for search button
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const results = exerciseData.exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm) ||
        exercise.category.toLowerCase().includes(searchTerm) ||
        exercise.type.toLowerCase().includes(searchTerm)
      );
      displayExerciseResults(results);
    });
  }

  //===== CONTAINER MANAGEMENT FUNCTIONS =====
  
  //Function to open the choose exercise container
  function openChooseExercise() {
    console.log("Opening choose exercise container");
    
    //Make container visible using both inline styles and classes
    chooseExerciseContainer.style.display = 'block';
    chooseExerciseContainer.style.visibility = 'visible';
    chooseExerciseContainer.style.opacity = '1';
    chooseExerciseContainer.classList.add('search-exercise-visible');
    
    //Make sure the categories are visible
    const categories = chooseExerciseContainer.querySelector('.categories');
    if (categories) {
      categories.style.display = 'flex';
      categories.style.visibility = 'visible';
      categories.style.opacity = '1';
    }
    
    //Show the overlay
    overlayDiv.style.display = 'block';
    
    console.log("Choose exercise container should now be visible");
  }
  
  //Function to close the choose exercise container
  function closeChooseExercise() {
    chooseExerciseContainer.style.visibility = 'hidden';
    chooseExerciseContainer.style.opacity = '0';
    chooseExerciseContainer.classList.remove('search-exercise-visible');
    
    //Only hide overlay if search exercise is also closed
    if (searchExerciseDiv.style.visibility !== 'visible') {
      overlayDiv.style.display = 'none';
    }
  }
  
  //Function to open the search exercise container
  function openSearchExercise() {
    searchExerciseDiv.style.visibility = 'visible';
    searchExerciseDiv.style.opacity = '1';
    searchExerciseDiv.classList.add('search-exercise-visible');
    overlayDiv.style.display = 'block';
    
    //Display exercises based on the currently selected category
    displayFindExerciseResults();
  }

  //Function to close the search exercise container
  function closeSearchExercise() {
    searchExerciseDiv.style.visibility = 'hidden';
    searchExerciseDiv.style.opacity = '0';
    searchExerciseDiv.classList.remove('search-exercise-visible');
    
    //Only hide overlay if choose exercise is also closed
    if (chooseExerciseContainer.style.visibility !== 'visible') {
    overlayDiv.style.display = 'none';
  }
  }

  //===== CATEGORY AND SELECTION FUNCTIONS =====
  
  //Set active selection based on category
  function setActiveSelectionByCategory(category) {
    //Clear all active states
    cardioSelection.classList.remove('active');
    gymSelection.classList.remove('active');
    sportSelection.classList.remove('active');
    outdoorSelection.classList.remove('active');
    
    //Set new active state based on category
    if (category === 'Cardio') {
      cardioSelection.classList.add('active');
    } else if (category === 'Gym') {
      gymSelection.classList.add('active');
    } else if (category === 'Sports') {
      sportSelection.classList.add('active');
    } else if (category === 'Outdoor') {
      outdoorSelection.classList.add('active');
    }
  }

  //Set active selection - modified to handle selection clicks
  function setActiveSelection(selectionElement) {
    //Clear all active states
    cardioSelection.classList.remove('active');
    gymSelection.classList.remove('active');
    sportSelection.classList.remove('active');
    outdoorSelection.classList.remove('active');
    
    //Set new active state
    selectionElement.classList.add('active');
    
    //Update the selected category based on which element is active
    if (selectionElement === cardioSelection) {
      selectedCategory = 'Cardio';
    } else if (selectionElement === gymSelection) {
      selectedCategory = 'Gym';
    } else if (selectionElement === sportSelection) {
      selectedCategory = 'Sports';
    } else if (selectionElement === outdoorSelection) {
      selectedCategory = 'Outdoor';
    }
  }

  //===== CALORIE AND PROGRESS FUNCTIONS =====
  
  //Function to calculate calories burned based on exercise category, duration, and intensity
  function calculateCaloriesBurned() {
    //Get the currently selected category
    let selectedCategory = '';
    if (cardioSelection.classList.contains('active')) {
      selectedCategory = 'Cardio';
    } else if (gymSelection.classList.contains('active')) {
      selectedCategory = 'Gym';
    } else if (sportSelection.classList.contains('active')) {
      selectedCategory = 'Sports';
    } else if (outdoorSelection.classList.contains('active')) {
      selectedCategory = 'Outdoor';
    }

    //Get duration and time unit
    const durationInput = document.getElementById('duration');
    const timeDropdown = document.getElementById('timedropdown');
    const duration = parseFloat(durationInput.value) || 0;
    const timeUnit = timeDropdown.value;

    //Convert duration to minutes
    let durationInMinutes = duration;
    if (timeUnit === 'option1') { //seconds
      durationInMinutes = duration / 60;
    } else if (timeUnit === 'option3') { //hours
      durationInMinutes = duration * 60;
    }

    //Get intensity
    const intensityDropdown = document.getElementById('intensitydropdown');
    const intensity = intensityDropdown.value;

    //Get MET value based on category and intensity
    let metValue = 0;
    
    if (selectedCategory === 'Cardio') {
      if (intensity === 'option1') metValue = 3.5;      //Light
      else if (intensity === 'option2') metValue = 5.83; //Moderate
      else if (intensity === 'option3') metValue = 8.17; //Active
      else if (intensity === 'option4') metValue = 11.67; //Very Active
    } else if (selectedCategory === 'Gym') {
      if (intensity === 'option1') metValue = 2.8;      //Light
      else if (intensity === 'option2') metValue = 4.0;  //Moderate
      else if (intensity === 'option3') metValue = 6.0;  //Active
      else if (intensity === 'option4') metValue = 8.0;  //Very Active
    } else if (selectedCategory === 'Sports') {
      if (intensity === 'option1') metValue = 4.0;      //Light
      else if (intensity === 'option2') metValue = 6.0;  //Moderate
      else if (intensity === 'option3') metValue = 8.5;  //Active
      else if (intensity === 'option4') metValue = 11.0; //Very Active
    } else if (selectedCategory === 'Outdoor') {
      if (intensity === 'option1') metValue = 3.5;      //Light
      else if (intensity === 'option2') metValue = 6.0;  //Moderate
      else if (intensity === 'option3') metValue = 8.0;  //Active
      else if (intensity === 'option4') metValue = 11.5; //Very Active
    }

    //Default weight in pounds (can be replaced with user's actual weight)
    const weightInPounds = 150;

    //Calculate calories burned using the formula: MET x 0.007935 x weight(lbs.) x time(minutes)
    const caloriesBurned = Math.round(metValue * 0.007935 * weightInPounds * durationInMinutes);

    //Update the calorie display
    const calorieDisplay = document.getElementById('calorie-list-number');
    if (calorieDisplay) {
      calorieDisplay.textContent = `${caloriesBurned} kcal`;
    }

    return caloriesBurned;
  }
  
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
    
    //Save data to local storage
    saveExerciseData();
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
  
  function updateCaloriesAndChart() {
    calorieData.forEach(item => {
      item.calories = 0;
    });
    
    const allExerciseItems = document.querySelectorAll('.log-item');
    
    totalCalories = 0;
    
    allExerciseItems.forEach(item => {
      const calories = parseInt(item.dataset.calories);
      const category = item.dataset.category || 'Personal';
      
      totalCalories += calories;
      
      const categoryIndex = calorieData.findIndex(data => data.category === category);
      if (categoryIndex !== -1) {
        calorieData[categoryIndex].calories += calories;
      }
    });
    
    totalCaloriesSpan.textContent = allExerciseItems.length > 0 ? totalCalories + " kcal" : "--";
    
    if (milestoneSet) {
      updateProgress();
    }
    
    updateChart();
    
    //Update dashboard calories count
    updateDashboardCaloriesCount();
    
    //Save data to local storage
    saveExerciseData();
  }

  //Function to update dashboard calories count
  function updateDashboardCaloriesCount() {
    //Get the current date as a string (YYYY-MM-DD)
    const dateString = currentDate.toISOString().split('T')[0];
    
    //Get user data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData._id || (userData.profile && userData.profile._id);
    
    if (!userId) {
      console.log('No user ID found, cannot save exercise data to dashboard');
      return;
    }
    
    //Get existing nutrition data from local storage
    const userNutrition = JSON.parse(localStorage.getItem(`userNutrition_${userId}`) || '{}');
    
    //Create or update data for the current date
    if (!userNutrition[dateString]) {
      userNutrition[dateString] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        exerciseCalories: 0
      };
    }
    
    //Update exercise calories
    userNutrition[dateString].exerciseCalories = totalCalories;
    
    //Save to local storage
    localStorage.setItem(`userNutrition_${userId}`, JSON.stringify(userNutrition));
    
    //Also save to the specific exercise key for backward compatibility
    localStorage.setItem(`healthai_exercise_${userId}`, totalCalories);
    
    //Trigger a dashboard refresh
    localStorage.setItem('healthai_refresh_dashboard', Date.now().toString());
    
    //If we're on the dashboard page, update the UI
    if (window.location.pathname.includes('index.html')) {
      //Update exercise-calories element
      const exerciseCaloriesElement = document.getElementById('exercise-calories');
      
      if (exerciseCaloriesElement) {
        exerciseCaloriesElement.textContent = totalCalories > 0 ? totalCalories : "0";
      }
    }
  }

  //===== DATE MANAGEMENT FUNCTIONS =====
  
  function updateDateDisplay() {
    const options = { month: 'long', day: 'numeric' };
    
    if (currentDate.getTime() === today.getTime()) {
      dateSpan.textContent = 'Today';
    } else {
      dateSpan.textContent = currentDate.toLocaleDateString('en-US', options);
    }
  }

  //===== CHART FUNCTIONS =====
  
  const calorieData = [
    { category: 'Gym', calories: 0 },
    { category: 'Cardio', calories: 0 },
    { category: 'Sports', calories: 0 },
    { category: 'Outdoor', calories: 0 }
  ];

  const chartColors = [
    'rgb(54, 162, 235)',   
    'rgb(255, 221, 0)',   
    'rgb(247, 111, 0)',  
    'rgb(4, 148, 23)'
  ];

  function updateChart() {
    const chartInstance = Chart.getChart('caloriechart');
    
    if (chartInstance) {
      chartInstance.data.labels = calorieData.map(item => item.category);
      chartInstance.data.datasets[0].data = calorieData.map(item => item.calories);
      
      chartInstance.update();
    }
  }

  //===== EVENT LISTENERS =====
  
  //Add event listeners for search
  if (exerciseSearchInput) {
    exerciseSearchInput.addEventListener('input', function() {
      searchExercises(this.value, exercises);
    });
  }
  
  if (searchExerciseBtn) {
    searchExerciseBtn.addEventListener('click', function() {
      searchExercises(this.value, exercises);
    });
  }
  
  //Add event listeners for exercise input box
  if (exerciseInputBox) {
    exerciseInputBox.addEventListener('input', function() {
      const searchTerm = this.value.trim();
      displayFindExerciseResults(searchTerm);
    });
  }
  
  //Add event listeners for duration and intensity inputs
  const durationInput = document.getElementById('duration');
  const timeDropdown = document.getElementById('timedropdown');
  const intensityDropdown = document.getElementById('intensitydropdown');
  
  if (durationInput) {
    durationInput.addEventListener('input', calculateCaloriesBurned);
  }
  
  if (timeDropdown) {
    timeDropdown.addEventListener('change', calculateCaloriesBurned);
  }
  
  if (intensityDropdown) {
    intensityDropdown.addEventListener('change', calculateCaloriesBurned);
  }
  
  //Add event listeners for date navigation
  yesterdayBtn.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
    loadExerciseData();
  });
  
  tomorrowBtn.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
    loadExerciseData();
  });
  
  //Add event listener for milestone button
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
    
    //Save data to local storage
    saveExerciseData();
  });
  
  //Add event listeners for Add Exercise button
  addExerciseBtn.addEventListener('click', function() {
    console.log("Add Exercise button clicked");
    openChooseExercise();
  });

  //Add event listeners for Add to Diary button
  addToDiary.addEventListener('click', function() {
    //Check if an exercise is selected
    if (!selectedExercise) {
      alert('Please select an exercise first');
      return;
    }
    
    //Check if duration is specified
    const durationInput = document.getElementById('duration');
    const duration = parseFloat(durationInput.value);
    if (isNaN(duration) || duration <= 0) {
      alert('Please enter a valid duration');
      durationInput.focus();
      return;
    }
    
    //Check if intensity is selected
    const intensityDropdown = document.getElementById('intensitydropdown');
    if (!intensityDropdown.value) {
      alert('Please select an intensity level');
      intensityDropdown.focus();
      return;
    }
    
    if (!selectedCategory) {
      alert('Please select an exercise category first');
      return;
    }
    
    if (logContainer.children.length === 0) {
      exerciseCount = 0;
    }
    
    exerciseCount++;
    
    const now = new Date();
    const dateTimeStr = now.toLocaleString();
    
    //Get calories from the calorie estimate display
    const caloriesText = calorieListNumber.textContent;
    const caloriesBurned = parseInt(caloriesText) || Math.floor(Math.random() * 300) + 100;
    
    const logItem = document.createElement('div');
    logItem.className = 'log-item';
    
    //Use selected exercise name if available, otherwise use category
    const exerciseName = selectedExercise ? selectedExercise.name : `${selectedCategory} Exercise ${exerciseCount}`;
    
    logItem.innerHTML = `
      <div class="log-item-title">${exerciseName}</div>
      <div class="log-item-calories">Calories: ${caloriesBurned} kcal</div>
      <div class="log-item-time">${dateTimeStr}</div>
      <div class="log-item-trash"><i class='bx bxs-trash'></i></div>
    `;
    
    logItem.dataset.calories = caloriesBurned;
    logItem.dataset.category = selectedCategory;
    
    const trashIcon = logItem.querySelector('.log-item-trash');
    trashIcon.addEventListener('click', function() {
      logItem.style.animation = 'fadeOut 0.3s';
      
      setTimeout(() => {
        logContainer.removeChild(logItem);
        updateCaloriesAndChart();
        saveExerciseData();
      }, 300);
    });
    
    logContainer.prepend(logItem);
    
    updateCaloriesAndChart();
    saveExerciseData();
    
    //Reset the form
    durationInput.value = '';
    intensityDropdown.selectedIndex = 0;
    calorieListNumber.textContent = '-- kcal';
    
    //Close the containers
    closeSearchExercise();
    closeChooseExercise();
  });

  //Add event listeners for category buttons
  cardioCategory.addEventListener('click', function(){
    selectedCategory = 'Cardio';
    setActiveSelection(cardioSelection);
    closeChooseExercise();
    openSearchExercise();
  });

  gymCategory.addEventListener('click', function(){
    selectedCategory = 'Gym';
    setActiveSelection(gymSelection);
    closeChooseExercise();
    openSearchExercise();
  });

  outdoorCategory.addEventListener('click', function(){
    selectedCategory = 'Outdoor';
    setActiveSelection(outdoorSelection);
    closeChooseExercise();
    openSearchExercise();
  });

  sportsCategory.addEventListener('click', function(){
    selectedCategory = 'Sports';
    setActiveSelection(sportSelection);
    closeChooseExercise();
    openSearchExercise();
  });

  //Add event listener for overlay
  overlayDiv.addEventListener('click', function(event) {
    if (event.target === overlayDiv) {
      closeSearchExercise();
      closeChooseExercise();
    }
  });

  //Add event listener for close button
  if (closeExerciseBtn) {
    closeExerciseBtn.addEventListener('click', function() {
      closeSearchExercise();
    });
  }
  
  //Add direct click handlers for selection elements
  cardioSelection.addEventListener('click', function() {
    setActiveSelection(cardioSelection);
  });

  gymSelection.addEventListener('click', function() {
    setActiveSelection(gymSelection);
  });

  sportSelection.addEventListener('click', function() {
    setActiveSelection(sportSelection);
  });

  outdoorSelection.addEventListener('click', function() {
    setActiveSelection(outdoorSelection);
  });

  //===== INITIALIZATION =====
  
  //Initialize exercise search
  initializeExerciseSearch();
  
  //Update date display
  updateDateDisplay();
  
  //Load data for the current date
  loadExerciseData();
  
  //Initialize chart
  updateCaloriesAndChart();
  
  //Add styles for animations
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

    @media screen and (max-width: 1550px) {
      .log-item-title {
        font-size: 14px;
      }
      
      .log-item-calories {
        font-size: 12px;
      }
      
      .log-item-time {
        font-size: 10px;
      }
      
      .log-item-trash i {
        font-size: 16px;
      }
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
    
    .no-results {
      padding: 15px;
      text-align: center;
      color: #666;
    }
    
    .exercise-item {
      cursor: pointer;
      transition: background-color 0.2s;
    }
  `;
  document.head.appendChild(style);

  //Function to display exercises in the find-exercise-container
  function displayFindExerciseResults(searchTerm = '') {
    const exerciseSuggestions = document.getElementById('exercisesuggestions');
    if (!exerciseSuggestions) return;

    //Clear existing suggestions
    exerciseSuggestions.innerHTML = '';

    //Get all exercises from the embedded data
    const exercises = exerciseData.exercises;

    //Get the currently selected category
    let selectedCategory = '';
    if (cardioSelection.classList.contains('active')) {
      selectedCategory = 'Cardio';
    } else if (gymSelection.classList.contains('active')) {
      selectedCategory = 'Gym';
    } else if (sportSelection.classList.contains('active')) {
      selectedCategory = 'Sports';
    } else if (outdoorSelection.classList.contains('active')) {
      selectedCategory = 'Outdoor';
    }

    //Filter exercises by the selected category
    let filteredExercises = selectedCategory 
      ? exercises.filter(ex => ex.category === selectedCategory)
      : exercises;
    
    //Further filter by search term if provided
    if (searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      filteredExercises = filteredExercises.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm) || 
        ex.category.toLowerCase().includes(searchTerm)
      );
    }

    //Create and append exercise items
    filteredExercises.forEach(exercise => {
      const exerciseItem = document.createElement('div');
      exerciseItem.className = 'exercise-item';
      
      //Set icon and color based on category
      let iconClass, iconColor;
      switch(exercise.category) {
        case 'Cardio':
          iconClass = 'bx-run';
          iconColor = 'rgb(255, 221, 0)'; //Yellow
          break;
        case 'Gym':
          iconClass = 'bx-dumbbell';
          iconColor = 'rgb(54, 162, 235)'; //Blue
          break;
        case 'Sports':
          iconClass = 'bxs-basketball bx-rotate-270';
          iconColor = 'rgb(247, 111, 0)'; //Orange
          break;
        case 'Outdoor':
          iconClass = 'bxs-tree-alt';
          iconColor = 'rgb(4, 148, 23)'; //Green
          break;
        default:
          iconClass = 'bx-dumbbell';
          iconColor = 'rgb(255, 221, 0)'; //Default to yellow
      }

      exerciseItem.innerHTML = `
        <div class="exercise-icon" style="color: ${iconColor}">
          <i class='bx ${iconClass}'></i>
        </div>
        <span id="workout-name">${exercise.name}</span>
        <span id="workout-category">${exercise.category}</span>
      `;

      //Add click event listener
      exerciseItem.addEventListener('click', () => {
        selectExercise(exercise, exerciseItem);
      });

      exerciseSuggestions.appendChild(exerciseItem);
    });
  }

  //Add event listeners for category selections
  cardioSelection.addEventListener('click', function() {
    setActiveSelection(cardioSelection);
    displayFindExerciseResults(); //Refresh the exercise list
  });

  gymSelection.addEventListener('click', function() {
    setActiveSelection(gymSelection);
    displayFindExerciseResults(); //Refresh the exercise list
  });

  sportSelection.addEventListener('click', function() {
    setActiveSelection(sportSelection);
    displayFindExerciseResults(); //Refresh the exercise list
  });

  outdoorSelection.addEventListener('click', function() {
    setActiveSelection(outdoorSelection);
    displayFindExerciseResults(); //Refresh the exercise list
  });

  //Display exercises when the add exercise button is clicked
  addExerciseBtn.addEventListener('click', () => {
    chooseExerciseContainer.style.display = 'block';
    //Don't call displayFindExerciseResults here as it will be called when a category is selected
  });

  //===== DATA PERSISTENCE FUNCTIONS =====
  
  //Function to save exercise data to local storage
  function saveExerciseData() {
    //Get the current date as a string (YYYY-MM-DD)
    const dateString = currentDate.toISOString().split('T')[0];
    
    //Get existing data from local storage
    let exerciseData = JSON.parse(localStorage.getItem('exerciseData')) || {};
    
    //Create or update data for the current date
    exerciseData[dateString] = {
      exercises: Array.from(document.querySelectorAll('.log-item')).map(item => ({
        name: item.querySelector('.log-item-title').textContent,
        calories: parseInt(item.dataset.calories) || 0,
        category: item.dataset.category || 'Personal',
        time: item.querySelector('.log-item-time').textContent
      })),
      totalCalories: totalCalories,
      milestoneGoal: calorieGoal,
      milestoneSet: milestoneSet,
      goalAchieved: goalAchieved,
      chartData: calorieData,
      //Save progress details
      progressPercentage: progressPercentage.textContent,
      progressRemainingCalories: progressRemainingCalories.textContent,
      progressBarWidth: progressBar.style.width
    };
    
    //Save to local storage
    localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
  }
  
  //Function to load exercise data from local storage
  function loadExerciseData() {
    //Get the current date as a string (YYYY-MM-DD)
    const dateString = currentDate.toISOString().split('T')[0];
    
    //Get data from local storage
    const exerciseData = JSON.parse(localStorage.getItem('exerciseData')) || {};
    
    //Check if data exists for the current date
    if (exerciseData[dateString]) {
      const data = exerciseData[dateString];
      
      //Clear existing log items
      const logContainer = document.querySelector('.exerciselog-container');
      logContainer.innerHTML = '';
      
      //Add log items from storage
      data.exercises.forEach(exercise => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.dataset.calories = exercise.calories;
        logItem.dataset.category = exercise.category;
        
        logItem.innerHTML = `
          <div class="log-item-title">${exercise.name}</div>
          <div class="log-item-calories">Calories: ${exercise.calories} kcal</div>
          <div class="log-item-time">${exercise.time}</div>
          <div class="log-item-trash"><i class='bx bxs-trash'></i></div>
        `;
        
        //Add trash icon event listener
        const trashIcon = logItem.querySelector('.log-item-trash');
        trashIcon.addEventListener('click', function() {
          logItem.style.animation = 'fadeOut 0.3s';
          
          setTimeout(() => {
            logContainer.removeChild(logItem);
            updateCaloriesAndChart();
            saveExerciseData();
          }, 300);
        });
        
        logContainer.appendChild(logItem);
      });
      
      //Update total calories
      totalCalories = data.totalCalories;
      totalCaloriesSpan.textContent = totalCalories > 0 ? `${totalCalories} kcal` : "--";
      
      //Update milestone data
      calorieGoal = data.milestoneGoal || 0;
      milestoneSet = data.milestoneSet || false;
      goalAchieved = data.goalAchieved || false;
      
      //Update milestone input if goal is set
      if (milestoneSet) {
        milestoneInput.value = calorieGoal;
      } else {
        //Reset milestone input if no goal is set for this date
        milestoneInput.value = '';
      }
      
      //Update chart data
      if (data.chartData) {
        calorieData.forEach((item, index) => {
          if (data.chartData[index]) {
            item.calories = data.chartData[index].calories;
          }
        });
        updateChart();
      }
      
      //Update progress details
      if (data.progressPercentage) {
        progressPercentage.textContent = data.progressPercentage;
      }
      
      if (data.progressRemainingCalories) {
        progressRemainingCalories.textContent = data.progressRemainingCalories;
      }
      
      if (data.progressBarWidth) {
        progressBar.style.width = data.progressBarWidth;
      }
      
      //Update progress if milestone is set
      if (milestoneSet) {
        updateProgress();
      }
    } else {
      //No data for this date, reset everything
      resetExerciseData();
    }
  }
  
  //Function to reset exercise data for a new date
  function resetExerciseData() {
    //Clear log container
    const logContainer = document.querySelector('.exerciselog-container');
    logContainer.innerHTML = '';
    
    //Reset total calories
    totalCalories = 0;
    totalCaloriesSpan.textContent = "--";
    
    //Reset chart data
    calorieData.forEach(item => {
      item.calories = 0;
    });
    updateChart();
    
    //Reset progress details
    progressPercentage.textContent = "--%";
    progressRemainingCalories.textContent = "-- kcal";
    progressBar.style.width = "0%";
    
    //Reset milestone input
    milestoneInput.value = '';
    
    //Reset milestone data for this date
    calorieGoal = 0;
    milestoneSet = false;
    goalAchieved = false;
  }
});