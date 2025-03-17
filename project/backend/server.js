const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Load environment variables
dotenv.config();

// Initialize express application
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up frontend path
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use('/HTML', express.static(path.join(frontendPath, 'HTML')));
app.use('/CSS', express.static(path.join(frontendPath, 'CSS')));
app.use('/JS', express.static(path.join(frontendPath, 'JS')));
app.use('/images', express.static(path.join(frontendPath, 'images')));

// Import dependencies with better error handling
let User;
let auth;
let connectDB;

try {
  // Authentication middleware
  auth = require('./middleware/auth');
  // User model
  User = require('./models/user');
  // Database connection
  connectDB = require('./config/db');
  console.log('Dependencies loaded successfully');
} catch (err) {
  console.error('Error loading dependencies:', err.message);
  process.exit(1);
}

// Connection and server startup function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');
    
    // ===== AUTH ROUTES =====
    
    // @route   POST /api/auth/register
    // @desc    Register a user
    // @access  Public
    app.post(
      '/api/auth/register',
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
    app.post(
      '/api/auth/login',
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
          let user = await User.findOne({ username }); // Changed from 'email' to 'username'

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

    // ===== USER SPECIFIC DATA ROUTES =====
    // Add more routes for user data if needed (GET/POST for user-specific data)
    
    // ===== PAGE ROUTES =====
    app.get('/', (req, res) => {
      const loginPath = path.join(frontendPath, 'HTML', 'login.html');
      console.log('Trying to serve:', loginPath);

      if (fs.existsSync(loginPath)) {
        res.sendFile(loginPath);
      } else {
        console.error('Login HTML file not found at path:', loginPath);
        res.status(404).send('Login file not found. Check server console for details.');
      }
    });

    app.get('/register', (req, res) => {
      const registerPath = path.join(frontendPath, 'HTML', 'register.html');

      if (fs.existsSync(registerPath)) {
        res.sendFile(registerPath);
      } else {
        console.error('Register HTML file not found at path:', registerPath);
        res.status(404).send('Register file not found.');
      }
    });

    app.get('/dashboard', (req, res) => {
      const dashboardPath = path.join(frontendPath, 'HTML', 'index.html');
      console.log('Trying to serve dashboard from:', dashboardPath);
      
      // Note: In a real production app, we would check authentication here
      // For now, we're just checking if the file exists
      if (fs.existsSync(dashboardPath)) {
        res.sendFile(dashboardPath);
      } else {
        console.error('Dashboard HTML file not found at path:', dashboardPath);
        res.status(404).send('Dashboard file not found. Check server console for details.');
      }
    });

    app.get('/direct-dashboard', (req, res) => {
      const dashboardPath = path.join(frontendPath, 'HTML', 'index.html');
      res.sendFile(dashboardPath);
    });

    app.get('/bypass-dashboard', (req, res) => {
      const dashboardPath = path.join(frontendPath, 'HTML', 'index.html');
      
      if (fs.existsSync(dashboardPath)) {
        // Read the dashboard HTML file
        fs.readFile(dashboardPath, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading dashboard file:', err);
            return res.status(500).send('Server Error');
          }
          
          // Add a token to localStorage without modifying window.location
          const modifiedData = data.replace('</head>', `
            <script>
              // Set token in localStorage if not present
              if (!localStorage.getItem('token')) {
                localStorage.setItem('token', 'bypass-token');
                console.log('Added bypass token');
              }
            </script>
            </head>`);
          
          res.send(modifiedData);
        });
      } else {
        console.error('Dashboard HTML file not found at path:', dashboardPath);
        res.status(404).send('Dashboard file not found.');
      }
    });

    app.get('/api/test', (req, res) => {
      console.log('Test endpoint hit');
      res.json({ message: 'Server is working!' });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('Global error handler:', err.stack);
      res.status(500).json({ msg: 'Server Error', error: err.message });
    });

    // Catch-all route for SPA
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'HTML', 'login.html'));
    });

    app.get('/test-file/:filename', (req, res) => {
      const filePath = path.join(frontendPath, 'HTML', req.params.filename);
      console.log('Testing file access:', filePath);
      if (fs.existsSync(filePath)) {
        res.send(`File ${req.params.filename} exists!`);
      } else {
        res.status(404).send(`File ${req.params.filename} not found!`);
      }
    });

    // Add this to your server.js if it's not already there
    app.get('/api/auth/user', auth, async (req, res) => {
      try {
        // Get user data without password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
      } catch (err) {
        console.error('Get user error:', err.message);
        // Send a JSON error response, not HTML
        res.status(500).json({ msg: 'Server Error' });
      }
    });

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT} to see your login page`);
    });

  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

// Start the server
startServer();