const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Get user profile
router.get('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        
        // If no profile exists, create one with default values
        if (!profile) {
            console.log('No profile found, creating new one for user:', req.user.id);
            profile = new Profile({
                user: req.user.id,
                username: '',
                firstName: '',
                lastName: '',
                email: '',
                profilePicture: '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            await profile.save();
            console.log('New profile created:', profile);
        }
        
        res.json(profile);
    } catch (err) {
        console.error('Error in GET /api/profile:', err);
        res.status(500).json({ error: err.message });
    }
});

// Update user profile
router.put('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`Profile update request for user ID: ${userId}`);
        console.log('Update data:', req.body);
        
        // Get the user from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Check if the user already has a profile
        let profile = await Profile.findOne({ user: userId });
        
        // If no profile exists, create a new one
        if (!profile) {
            console.log('Creating new profile for user...');
            profile = new Profile({
                user: userId,
                ...req.body
            });
        } else {
            console.log('Updating existing profile...');
            // Update fields from request body
            Object.keys(req.body).forEach(key => {
                profile[key] = req.body[key];
            });
        }
        
        // Save the profile
        await profile.save();
        console.log('Profile saved successfully');
        
        // If profilePicture is included, also update it in the user document
        if (req.body.profilePicture) {
            console.log('Updating user profile picture...');
            user.profilePicture = req.body.profilePicture;
            await user.save();
            console.log('User profile picture updated');
        }
        
        // If firstName or lastName is included, log for debugging
        if (req.body.firstName || req.body.lastName) {
            console.log(`Name updated: ${req.body.firstName} ${req.body.lastName}`);
        }
        
        // Return the complete profile data including the firstName and lastName
        return res.json(profile);
    } catch (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Change password route
router.put('/change-password', auth, async (req, res) => {
    try {
        console.log('Password change request for user:', req.user.id);
        const { currentPassword, newPassword } = req.body;

        // Get user from database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in users collection
        user.password = hashedPassword;
        await user.save();

        // Update password in profiles collection
        const profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            profile.currentPassword = hashedPassword;
            profile.newPassword = hashedPassword;
            profile.confirmPassword = hashedPassword;
            await profile.save();
        }

        console.log('Password updated successfully for user:', req.user.id);
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error in password change:', err);
        res.status(500).json({ error: err.message });
    }
});

// Change email route
router.put('/change-email', auth, async (req, res) => {
  try {
    const { currentEmail, newEmail } = req.body;
    const userId = req.user.id;
    
    console.log(`Email change request from user ${userId}: ${currentEmail} -> ${newEmail}`);
    
    if (!currentEmail || !newEmail) {
      return res.status(400).json({ error: 'Current email and new email are required' });
    }
    
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current email matches
    if (user.email !== currentEmail) {
      console.log(`Email mismatch: ${user.email} (stored) vs ${currentEmail} (provided)`);
      return res.status(400).json({ error: 'Current email does not match our records' });
    }
    
    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser.id !== userId) {
      console.log(`Email ${newEmail} already in use by another user`);
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Update email in user collection
    user.email = newEmail;
    await user.save();
    console.log(`User email updated for user ${userId}`);
    
    // Update email in profile collection if it exists
    const profile = await Profile.findOne({ user: userId });
    if (profile) {
      profile.email = newEmail;
      await profile.save();
      console.log(`Profile email updated for user ${userId}`);
    } else {
      console.log(`No profile found for user ${userId}, creating a new one`);
      const newProfile = new Profile({
        user: userId,
        username: user.username,
        email: newEmail
      });
      await newProfile.save();
    }
    
    // Get updated profile for response
    const updatedProfile = await Profile.findOne({ user: userId });
    
    res.json({
      message: 'Email updated successfully',
      profile: updatedProfile
    });
  } catch (err) {
    console.error('Error changing email:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload profile picture
router.post('/upload-image', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { imageData } = req.body;
    
    console.log(`Starting profile image upload for user ${userId}`);
    console.log(`Image data size: ${imageData ? (imageData.length / 1024).toFixed(2) + 'KB' : 'No image data'}`);
    
    if (!imageData) {
      console.log('No image data received in request');
      return res.status(400).json({ error: 'Image data is required' });
    }
    
    // Find the user
    console.log(`Finding user with ID: ${userId}`);
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Find or create a profile for the user
    console.log(`Finding profile for user ${userId}`);
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      console.log(`No profile found, creating new profile for user ${userId}`);
      // Make sure to include the username from the user document
      profile = new Profile({
        user: userId,
        username: user.username || 'user_' + userId, // Ensure username is never empty
        email: user.email || '',
        firstName: '',
        lastName: ''
      });
      console.log(`Created new profile with username: ${profile.username}`);
    } else {
      console.log(`Found existing profile with username: ${profile.username}`);
      // Ensure username is set even on existing profiles
      if (!profile.username && user.username) {
        profile.username = user.username;
      }
    }
    
    // Update profile with the image data
    console.log('Updating profile with new image data');
    profile.profilePicture = imageData;
    
    console.log('Saving profile...');
    await profile.save()
      .then(() => console.log('Profile saved successfully'))
      .catch(err => {
        console.error('Error saving profile:', err);
        throw new Error(`Failed to save profile: ${err.message}`);
      });
    
    // Also update the user document with the profile picture
    console.log('Updating user document with profile picture');
    user.profilePicture = imageData;
    
    console.log('Saving user...');
    await user.save()
      .then(() => console.log('User saved successfully'))
      .catch(err => {
        console.error('Error saving user:', err);
        throw new Error(`Failed to save user: ${err.message}`);
      });
    
    console.log(`Profile picture updated for user ${userId}`);
    
    res.json({ 
      success: true, 
      message: 'Profile picture updated successfully',
      profilePicture: profile.profilePicture 
    });
  } catch (err) {
    console.error('Error in upload-image route:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

module.exports = router;
