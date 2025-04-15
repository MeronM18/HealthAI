const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Health = require('../models/Health');
const User = require('../models/user');

// @route   GET api/health
// @desc    Get current user's health information
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const healthData = await Health.find({ user: req.user.id }).sort({ date: -1 });
    
    // If no health record exists, create one with default values
    if (!healthData.length) {
      console.log('No health record found, creating new one');
      const health = new Health({
        user: req.user.id
      });
      await health.save();
      console.log('New health record created');
    }
    
    res.json(healthData);
  } catch (err) {
    console.error('Error in GET /api/health:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT api/health
// @desc    Update user health information
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    console.log('PUT /api/health - User ID:', req.user.id);
    console.log('Update data:', req.body);
    
    const {
      age,
      height,
      weight,
      gender,
      goalWeight,
      weeklyGoal,
      activityLevel
    } = req.body;
    
    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (height && weight) {
      // Convert pounds to kilograms
      const weightKg = weight * 0.45359237;
      
      // Convert inches to meters
      const heightMeters = height * 0.0254;
      
      // Standard scientific BMI formula: weight (kg) / height (m)^2
      bmi = weightKg / (heightMeters * heightMeters);
      bmi = parseFloat(bmi.toFixed(1)); // Round to 1 decimal place
      console.log('Calculated BMI:', bmi);
    }
    
    // Build health object
    const healthFields = {};
    if (age) healthFields.age = age;
    if (height) healthFields.height = height;
    if (weight) healthFields.weight = weight;
    if (gender) healthFields.gender = gender;
    if (goalWeight) healthFields.goalWeight = goalWeight;
    if (weeklyGoal) healthFields.weeklyGoal = weeklyGoal;
    if (activityLevel) healthFields.activityLevel = activityLevel;
    if (bmi) healthFields.bmi = bmi;
    
    // Update lastUpdated timestamp
    healthFields.lastUpdated = Date.now();
    
    // Find health record for the user
    let health = await Health.findOne({ user: req.user.id });
    
    if (health) {
      // Update existing record
      health = await Health.findOneAndUpdate(
        { user: req.user.id },
        { $set: healthFields },
        { new: true }
      );
      console.log('Health record updated');
    } else {
      // Create new record
      health = new Health({
        user: req.user.id,
        ...healthFields
      });
      await health.save();
      console.log('New health record created');
    }
    
    res.json(health);
  } catch (err) {
    console.error('Error in PUT /api/health:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/health/sleep
// @desc    Add sleep log
// @access  Private
router.post('/sleep', auth, async (req, res) => {
  try {
    const { hours, minutes } = req.body;
    
    // Calculate total minutes
    const totalMinutes = (hours * 60) + minutes;
    
    const sleepLog = {
      hours,
      minutes,
      totalMinutes,
      date: Date.now()
    };
    
    const health = await Health.findOne({ user: req.user.id });
    
    if (!health) {
      // Create new health record with sleep log
      const newHealth = new Health({
        user: req.user.id,
        sleepLogs: [sleepLog]
      });
      await newHealth.save();
      return res.json(newHealth);
    }
    
    // Add sleep log to existing health record
    health.sleepLogs.unshift(sleepLog);
    await health.save();
    
    res.json(health);
  } catch (err) {
    console.error('Error adding sleep log:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/health/weight
// @desc    Add weight log
// @access  Private
router.post('/weight', auth, async (req, res) => {
  try {
    const { weight, date, image } = req.body;
    
    const weightLog = {
      weight,
      date: date || Date.now(),
      image: image || ''
    };
    
    const health = await Health.findOne({ user: req.user.id });
    
    if (!health) {
      // Create new health record with weight log
      const newHealth = new Health({
        user: req.user.id,
        weightLogs: [weightLog]
      });
      await newHealth.save();
      return res.json(newHealth);
    }
    
    // Add weight log to existing health record
    health.weightLogs.unshift(weightLog);
    await health.save();
    
    res.json(health);
  } catch (err) {
    console.error('Error adding weight log:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE api/health/sleep/:log_id
// @desc    Delete sleep log
// @access  Private
router.delete('/sleep/:log_id', auth, async (req, res) => {
  try {
    const health = await Health.findOne({ user: req.user.id });
    
    if (!health) {
      return res.status(404).json({ msg: 'Health record not found' });
    }
    
    // Get remove index
    const removeIndex = health.sleepLogs
      .map(log => log.id)
      .indexOf(req.params.log_id);
      
    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Sleep log not found' });
    }
    
    // Remove log
    health.sleepLogs.splice(removeIndex, 1);
    
    await health.save();
    
    res.json(health);
  } catch (err) {
    console.error('Error deleting sleep log:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE api/health/weight/:log_id
// @desc    Delete weight log
// @access  Private
router.delete('/weight/:log_id', auth, async (req, res) => {
  try {
    const health = await Health.findOne({ user: req.user.id });
    
    if (!health) {
      return res.status(404).json({ msg: 'Health record not found' });
    }
    
    // Get remove index
    const removeIndex = health.weightLogs
      .map(log => log.id)
      .indexOf(req.params.log_id);
      
    if (removeIndex === -1) {
      return res.status(404).json({ msg: 'Weight log not found' });
    }
    
    // Remove log
    health.weightLogs.splice(removeIndex, 1);
    
    await health.save();
    
    res.json(health);
  } catch (err) {
    console.error('Error deleting weight log:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 