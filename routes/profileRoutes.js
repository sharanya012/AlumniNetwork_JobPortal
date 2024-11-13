const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const multer = require('multer');
const path = require('path');

// Get complete profile data
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch user profile info from the database
        const userProfile = await Profile.getUserProfileById(userId);
        //console.log(userProfile)
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
                userType: userProfile.user_type,
                workExperience: userProfile.work_experience,
                resume: userProfile.resume,
                profilePicture: userProfile.profile_picture, // Send the profile picture or the default one
                email: userProfile.email,
                phoneNo: userProfile.phone_no,
                registrationDate: userProfile.registration_date,
                branchName: userProfile.branch_name,
                yearOfGraduation: userProfile.year_of_graduation
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





module.exports = router;
