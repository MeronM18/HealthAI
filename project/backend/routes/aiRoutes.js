const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../controllers/aiController');

//@route   POST /api/ai/chat
//@desc    Get AI response for user query
//@access  Public
router.post('/chat', getAIResponse);

module.exports = router; 