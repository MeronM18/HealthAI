const Meal = require('../models/meal');
const { validationResult } = require('express-validator');

//@desc    Get all meals for a user
//@route   GET /api/meals
//@access  Private
exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//@desc    Get meals for a specific date
//@route   GET /api/meals/:date
//@access  Private
exports.getMealsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const meals = await Meal.find({
      user: req.user.id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ date: 1 });

    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//@desc    Add a new meal
//@route   POST /api/meals
//@access  Private
exports.addMeal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      mealType,
      foodItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats
    } = req.body;

    const newMeal = new Meal({
      user: req.user.id,
      mealType,
      foodItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats
    });

    const meal = await newMeal.save();
    res.json(meal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//@desc    Update a meal
//@route   PUT /api/meals/:id
//@access  Private
exports.updateMeal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ msg: 'Meal not found' });
    }

    //Make sure user owns the meal
    if (meal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const {
      mealType,
      foodItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats
    } = req.body;

    //Update fields
    if (mealType) meal.mealType = mealType;
    if (foodItems) meal.foodItems = foodItems;
    if (totalCalories) meal.totalCalories = totalCalories;
    if (totalProtein) meal.totalProtein = totalProtein;
    if (totalCarbs) meal.totalCarbs = totalCarbs;
    if (totalFats) meal.totalFats = totalFats;
    
    meal.lastUpdated = Date.now();

    await meal.save();
    res.json(meal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Meal not found' });
    }
    res.status(500).send('Server Error');
  }
};

//@desc    Delete a meal
//@route   DELETE /api/meals/:id
//@access  Private
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ msg: 'Meal not found' });
    }

    //Make sure user owns the meal
    if (meal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await meal.remove();
    res.json({ msg: 'Meal removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Meal not found' });
    }
    res.status(500).send('Server Error');
  }
};

//@desc    Get daily nutrition stats
//@route   GET /api/meals/stats/daily
//@access  Private
exports.getDailyStats = async (req, res) => {
  try {
    const date = new Date(req.query.date || Date.now());
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const meals = await Meal.find({
      user: req.user.id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const stats = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      mealCount: meals.length,
      mealsByType: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snacks: 0,
        drinks: 0
      }
    };

    meals.forEach(meal => {
      stats.totalCalories += meal.totalCalories;
      stats.totalProtein += meal.totalProtein;
      stats.totalCarbs += meal.totalCarbs;
      stats.totalFats += meal.totalFats;
      stats.mealsByType[meal.mealType]++;
    });

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 