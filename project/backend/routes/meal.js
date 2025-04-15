const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const mealController = require('../controllers/meal');

// @route   GET /api/meals
// @desc    Get all meals for a user
// @access  Private
router.get('/', auth, mealController.getMeals);

// @route   GET /api/meals/:date
// @desc    Get meals for a specific date
// @access  Private
router.get('/:date', auth, mealController.getMealsByDate);

// @route   POST /api/meals
// @desc    Add a new meal
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('mealType', 'Meal type is required').not().isEmpty(),
      check('foodItems', 'Food items are required').isArray(),
      check('totalCalories', 'Total calories is required').isNumeric(),
      check('totalProtein', 'Total protein is required').isNumeric(),
      check('totalCarbs', 'Total carbs is required').isNumeric(),
      check('totalFats', 'Total fats is required').isNumeric()
    ]
  ],
  mealController.addMeal
);

// @route   PUT /api/meals/:id
// @desc    Update a meal
// @access  Private
router.put(
  '/:id',
  [
    auth,
    [
      check('mealType', 'Meal type is required').optional().not().isEmpty(),
      check('foodItems', 'Food items are required').optional().isArray(),
      check('totalCalories', 'Total calories is required').optional().isNumeric(),
      check('totalProtein', 'Total protein is required').optional().isNumeric(),
      check('totalCarbs', 'Total carbs is required').optional().isNumeric(),
      check('totalFats', 'Total fats is required').optional().isNumeric()
    ]
  ],
  mealController.updateMeal
);

// @route   DELETE /api/meals/:id
// @desc    Delete a meal
// @access  Private
router.delete('/:id', auth, mealController.deleteMeal);

// @route   GET /api/meals/stats/daily
// @desc    Get daily nutrition stats
// @access  Private
router.get('/stats/daily', auth, mealController.getDailyStats);

module.exports = router;
