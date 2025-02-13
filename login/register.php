<?php
include 'connect.php';

// Handle registration logic
if (isset($_POST['register'])) {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password = md5($password);  // You can later replace this with password_hash()

    // Check if the username already exists
    $checkUsername = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($checkUsername);
    
    if ($result->num_rows > 0) {
        echo "Username Already Exists!";
    } else {
        // Insert new user into the database
        $insertQuery = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password')";
        
        if ($conn->query($insertQuery) === TRUE) {
            header("Location: index.php"); // Redirect to index.php or login page after successful registration
            exit();
        } else {
            echo "Error: " . $conn->error;
        }
    }
}

// Handle login logic
if (isset($_POST['login-btn'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $password = md5($password);

    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        session_start();
        $row = $result->fetch_assoc();
        $_SESSION['username'] = $row['username'];
        header("Location: homepage.php"); 
        exit();
    } else {
        header("Location: index.php");
        
    }
}
?>
