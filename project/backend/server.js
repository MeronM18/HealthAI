const express = require('express'); //importing express.js framework for the foundation of server
const cors = require('cors'); //importing cross origin resource sharing middleware allowing frontend to make requests to backend if on different ports
const dotenv = require('dotenv'); //loads environment variables from .env file
const path = require('path'); //built in path-module that provides utility with working with files and directories 
const fs = require('fs'); //import built in file system module allowing you to work with file system on computer

//load environment variables
dotenv.config();

//initialize express application where app object is main interface of server where all functionality will be added
const app = express();


app.use(cors()); //applies cors middleware to all routes
app.use(express.json()); //parses incoming JSON requests
app.use(express.urlencoded({ extended: false }));


const frontendPath = path.join(__dirname, '..', 'frontend'); //creates the path to our frontend directory. _dirname is the directory of backend. the '..' tells the path to move up one level and enter frontend

app.use(express.static(frontendPath)); //this sets up express to serve static files HTML,CSS,JS,images and access them 


app.get('/', (req, res) => { //defines path for root URL / and when the site is visited, the login.html page is being sent to them
  const loginPath = path.join(frontendPath, 'HTML', 'login.html');
  console.log('Trying to serve:', loginPath);
  
  if (fs.existsSync(loginPath)) {
    res.sendFile(loginPath);
  } else {
    res.status(404).send('Login file not found. Check server console for details.');
  }
});


app.get('/api/test', (req, res) => { //this creates a test API endpoint that returns JSON to ensure that server is working
  res.json({ message: 'Server is working!' });
});


const PORT = process.env.PORT || 3000; //sets the port the server will listen on. either checks the .env file for a port or sets default value to 5000

app.listen(PORT, () => { //server starts and listens for incoming requests from the specified port 
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see your login page`);
});