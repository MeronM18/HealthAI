<?php
session_start();
include("connect.php");
?>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="CSS/general.css" class="css">

  <link rel="stylesheet" href="CSS/header.css" class="header">

  <link rel="stylesheet" href="CSS/sidebar.css" class="style">

  <link rel="stylesheet" href="CSS/dashboard.css" class="main">

  <link rel="icon" type="image/x-icon" href="logo1.png">

  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>


  <title>HealthAI</title>
</head>
<body>
  <div class="grid-container">
    <header>
      <div class="left-section">
        <button class="menu-button" id="toggle-btn">
          <i class='bx bx-menu hamburgermenu-icon'></i>
        </button>
        <a href= "homepage.php">
          <img class="logo" src="logo1.png">
        </a>
        <a href="homepage.php">
          <h2>Health<span class="danger">AI</span></h2>
        </a>
      </div>
      <div class="right-section">
        <img class="pfp" src="images/pfp.jpg">
        <h3>Meron Matti</h3>
        <button class="drop-button" id="submenu-btn">
          <i class='bx bx-chevron-up downarrow-icon'></i>
        </button>
        <ul class="sub-menu">
            <div class="sub-bars">
              <li><a href="#">Profile <i class='bx bx-user' ></i></a></li>
            </div>
            <div class="sub-bars">
              <li><a href="#">Settings <i class='bx bx-cog bx-rotate-180' ></i></a></li>
            </div>
            <div class="sub-bars">
              <li><a href="index.php">Logout <i class='bx bx-log-out bx-rotate-180' ></i></a></li>
            </div>
        </ul>
      </div>
    </header>
    <nav>
      <div class="topbar">
        <a href="homepage.php">
          <img class="nav-img" src="logo1.png">
        </a>
        <button class="closenav" id="close-btn">
          <i class='bx bx-x'></i>
        </button>
      </div>
      <ul>
        <li><a href="homepage.php" class="menu-items"><i class='bx bxs-dashboard menu-icon'></i>Dashboard</a></li>
        <li><a href="#" class="menu-items"><i class='bx bx-body menu-icon'></i>Health</a></li>
        <li><a href="#" class="menu-items"><i class='bx bxs-baguette menu-icon'></i>Meals</a></li>
        <li><a href="#" class="menu-items"><i class='bx bx-dumbbell menu-icon'></i>Exercise Log</a></li>
        <li><a href="#" class="menu-items"><i class='bx bxs-bot menu-icon'></i>AI Chat</a></li>
      </ul>
    </nav>
  </div>

</body>

<script>
  document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname.split('/').pop();
  const menuItems = document.querySelectorAll('.menu-items');

  menuItems.forEach(function(item){
    const link = item.getAttribute('href').split('/').pop();
    if (link == currentPage) {
      item.classList.add('active');
    }
  })
})

const toggleButton = document.getElementById('toggle-btn');
toggleButton.addEventListener("click", openSideBar);

function openSideBar() {
  const navbar = document.querySelector('nav');
  navbar.classList.toggle('show');
}


const closeButton = document.getElementById('close-btn');
closeButton.addEventListener("click", closeSideBar);

function closeSideBar(){
  const navbarshow = document.querySelector('nav');
  navbarshow.classList.remove('show');
}


const submenuButton = document.getElementById('submenu-btn');
submenuButton.addEventListener("click", toggleSideMenu);

function toggleSideMenu() {
  const submenu = document.querySelector('.sub-menu');
  submenu.classList.toggle('show');

  submenuButton.classList.toggle('downarrow-icon')
}

</script>
</html>