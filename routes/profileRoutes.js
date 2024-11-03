const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Get user profile data
router.get('/profile-data', async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                firstName: user.first_name,
                middleName: user.middle_name,
                lastName: user.last_name,
                email: user.email,
                branch: user.branch_of_study,
                graduationYear: user.graduation_year,
                // Add other fields as needed
            }
        });
    } catch (error) {
        console.error('Profile data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile data'
        });
    }
});

module.exports = router;