const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Meal = require('../models/meal');

// @route   GET api/meals
// @desc    Get all meals for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
        res.json(meals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/meals/:date
// @desc    Get meals for a specific date
// @access  Private
router.get('/:date', auth, async (req, res) => {
    try {
        // Convert date string to Date object
        const mealDate = new Date(req.params.date);
        
        // Set time to start of day for comparison
        const startOfDay = new Date(mealDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(mealDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        const meals = await Meal.find({
            user: req.user.id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        
        console.log(`Found ${meals.length} meals for date ${req.params.date}`);
        res.json(meals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/meals/stats/daily
// @desc    Get daily nutrition stats
// @access  Private
router.get('/stats/daily', auth, async (req, res) => {
    try {
        const date = req.query.date ? new Date(req.query.date) : new Date();
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
            mealCount: meals.length
        };

        meals.forEach(meal => {
            stats.totalCalories += meal.totalCalories;
            stats.totalProtein += meal.totalProtein;
            stats.totalCarbs += meal.totalCarbs;
            stats.totalFats += meal.totalFats;
        });

        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/meals
// @desc    Add a new meal
// @access  Private
router.post('/', [
    auth,
    [
        check('date', 'Date is required').not().isEmpty(),
        check('mealType', 'Meal type is required').not().isEmpty(),
        check('foodItems', 'Food items are required').isArray(),
        check('totalCalories', 'Total calories must be a number').isNumeric(),
        check('totalProtein', 'Total protein must be a number').isNumeric(),
        check('totalCarbs', 'Total carbs must be a number').isNumeric(),
        check('totalFats', 'Total fats must be a number').isNumeric()
    ]
], async (req, res) => {
    console.log('POST /api/meals - Request received');
    console.log('User ID:', req.user.id);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        date,
        mealType,
        foodItems,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFats
    } = req.body;
    
    console.log('Meal data:', {
        date,
        mealType,
        foodItemsCount: foodItems ? foodItems.length : 0,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFats
    });

    try {
        // Convert date string to Date object
        const mealDate = new Date(date);
        console.log('Converted date:', mealDate);
        
        const newMeal = new Meal({
            user: req.user.id,
            date: mealDate,
            mealType,
            foodItems,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFats
        });

        console.log('Saving meal to database...');
        const meal = await newMeal.save();
        console.log('Meal saved successfully:', meal._id);
        res.json(meal);
    } catch (err) {
        console.error('Error saving meal:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/meals/:id
// @desc    Update a meal
// @access  Private
router.put('/:id', [
    auth,
    [
        check('totalCalories', 'Total calories must be a number').isNumeric(),
        check('totalProtein', 'Total protein must be a number').isNumeric(),
        check('totalCarbs', 'Total carbs must be a number').isNumeric(),
        check('totalFats', 'Total fats must be a number').isNumeric()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        foodItems,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFats
    } = req.body;

    try {
        let meal = await Meal.findById(req.params.id);
        if (!meal) {
            return res.status(404).json({ msg: 'Meal not found' });
        }

        // Make sure user owns the meal
        if (meal.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        meal = await Meal.findByIdAndUpdate(
            req.params.id,
            {
                foodItems,
                totalCalories,
                totalProtein,
                totalCarbs,
                totalFats
            },
            { new: true }
        );

        res.json(meal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/meals/:id
// @desc    Delete a meal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id);
        if (!meal) {
            return res.status(404).json({ msg: 'Meal not found' });
        }

        // Make sure user owns the meal
        if (meal.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await meal.remove();
        res.json({ msg: 'Meal removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 