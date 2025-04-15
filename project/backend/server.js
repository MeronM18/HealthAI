const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Initialize express application
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
  // AI routes
  const aiRoutes = require('./routes/aiRoutes');
  // Use AI routes
  app.use('/api/ai', aiRoutes);
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
    
    // Define routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/profile', require('./routes/profile'));
    app.use('/api/health', require('./routes/health'));
    app.use('/api/meals', require('./routes/meals'));
    
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
      res.redirect('/HTML/index.html');
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('Global error handler:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    });

    // API routes should be registered before the catch-all route
    app.get('/api/test', (req, res) => {
      console.log('Test endpoint hit');
      res.json({ message: 'Server is working!' });
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

    // Catch-all route for SPA - should be last
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'HTML', 'index.html'));
    });

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Access the application at: http://localhost:${PORT}`);
      console.log(`Login page: http://localhost:${PORT}/HTML/login.html`);
    });
  } catch (err) {
    console.error('Error starting server:', err.message);
    process.exit(1);
  }
};

startServer();