const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const ProfileInfo = require('../models/profileModel');
const multer = require('multer');
const path = require('path');

// Get complete profile data
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch user profile info from the database
        const userProfile = await Profile.getUserProfileById(userId);

        if (!userProfile) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }

        // Send the profile data as a response
        res.json({
            success: true,
            data: {
                firstName: userProfile.first_name,
                middleName: userProfile.middle_name,
                lastName: userProfile.last_name,
 // If no profile picture, use a default one
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile data'
        });
    }
});




// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = file.fieldname === 'profile_picture' 
            ? 'public/uploads/profile_pictures'
            : 'public/uploads/resumes';
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});


// Update profile information
router.post('/update-profile', upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), async (req, res) => {
    try {
        const userId = req.session.userId;
        const profileData = {
            user_id: userId,
            batch_year: req.body.batch_year,
            branch: req.body.branch
        };

        // Add file URLs if files were uploaded
        if (req.files) {
            if (req.files.profile_picture) {
                profileData.profile_picture_url = '/uploads/profile_pictures/' + req.files.profile_picture[0].filename;
            }
            if (req.files.resume) {
                profileData.resume_url = '/uploads/resumes/' + req.files.resume[0].filename;
            }
        }

        await ProfileInfo.update(userId, profileData);

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
});

// Add work experience
router.post('/add-experience', async (req, res) => {
    try {
        const workData = {
            user_id: req.session.userId,
            company_name: req.body.company_name,
            position: req.body.position,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            description: req.body.description
        };

        await ProfileInfo.addWorkExperience(workData);

        res.json({
            success: true,
            message: 'Work experience added successfully'
        });
    } catch (error) {
        console.error('Add experience error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding work experience'
        });
    }
});

// Join forum
router.post('/join-forum', async (req, res) => {
    try {
        const { forumId } = req.body;
        await ProfileInfo.joinForum(req.session.userId, forumId);

        res.json({
            success: true,
            message: 'Joined forum successfully'
        });
    } catch (error) {
        console.error('Join forum error:', error);
        res.status(500).json({
            success: false,
            message: 'Error joining forum'
        });
    }
});

// Get profile page (Make sure to send profile data to this page when it's accessed)
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            graduationYear: user.graduation_year,
            branch: user.branch_of_study,
            profilePicture: user.profile_picture_url
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile data' });
    }
});

module.exports = router;
