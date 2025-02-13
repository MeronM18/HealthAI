<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
   <link rel="stylesheet" href="/login/style.css" class="style">

   <link rel="icon" type="image/x-icon" href="images/logo1.png">
   
   <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

   <script src="script.js"></script>
   
   <title>HealthAI Login</title>
</head>
<body>
  <div class="container">

    <div class="brand">
      <img class="logo" src="images/logo1.png">
      <h1>Health<span class="dangers">AI</span></h1>
    </div>

    <div class="login-formbox">
      <form method="post" action="register.php">
        <h1>Login</h1>
        <div class="inputbox">
          <input class="usernamebox" type="text" placeholder="Username" name="username" required>
          <i class='bx bxs-user' ></i>
        </div>
          <div class="inputbox">
            <input class="passwordbox" type="password" placeholder="Password" id="password-login" name="password" required>
            <i class='bx bxs-lock-alt lockicon' id="lockicon-login"></i>
          </div>
        <div class="specialbox">
          <input class="checkbox" type="checkbox">
          <h3>Remember me</h3>
          <h3><a href="/">Forgot password?</a></h3>
        </div>
          <button class="login-btn" id="login-btn" name="login-btn">Login</button>
      </form>
    </div>


    <div class="togglebox">
      <div class="toggle-left-panel">
        <h1 class="hello">Hello, Welcome!</h1>
        <p id="message">Don't have an account?</p>
        <button onclick="changeForm()" class="register-btn" id="register">Register</button>
      </div>
    </div>

    <div class="register-formbox">
      <form method="post" action="register.php">
        <h1>Register</h1>
        <div class="inputbox">
          <input class="usernamebox" type="text" placeholder="Username" name="username" required>
          <i class='bx bxs-user' ></i>
        </div>
        <div class="inputbox">
          <input class="emailbox" type="text" placeholder="Email" name="email" required>
          <i class='bx bxs-envelope' ></i>
        </div>
          <div class="inputbox">
            <input class="passwordbox" type="password" placeholder="Password" id="password-register" name="password" required>
            <i class='bx bxs-lock-alt lockicon' id="lockicon-register" ></i>
          </div>
          <button class="registerr-btn" id="registerr-btn" name="register">Register</button>
      </form>
    </div>

  </div>
</body>
</html>