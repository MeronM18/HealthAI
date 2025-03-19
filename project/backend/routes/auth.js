const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/user');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    console.log('Register endpoint hit with data:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if user exists by username
      let userByUsername = await User.findOne({ username });
      if (userByUsername) {
        console.log('User already exists with username:', username);
        return res.status(400).json({ msg: 'Username already exists' });
      }

      // Check if user exists by email
      let userByEmail = await User.findOne({ email });
      if (userByEmail) {
        console.log('User already exists with email:', email);
        return res.status(400).json({ msg: 'Email already in use' });
      }

      user = new User({
        username,
        email,
        password
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      console.log('New user created with ID:', user.id);

      // Create and return JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }, // Token expires in 1 hour
        (err, token) => {
          if (err) {
            console.error('JWT sign error:', err);
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Registration error details:', err);
      res.status(500).json({ msg: 'Server Error', error: err.message });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('username', 'Please include a valid username').not().isEmpty(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    console.log('Login endpoint hit with username:', req.body.username);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if user exists by username
      let user = await User.findOne({ username });

      if (!user) {
        console.log('Invalid login attempt - user not found:', username);
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Invalid login attempt - password mismatch for:', username);
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Create and return JWT
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }, // Token expires in 1 hour
        (err, token) => {
          if (err) throw err;
          console.log('Login successful for:', username);
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    // Get user data without password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;