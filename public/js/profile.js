// routes/profile.js
const express = require('express');
const Profile = require('../models/profileModel');
const router = express.Router();

router.get('/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userProfile = await Profile.getUserProfileById(userId);
        if (userProfile) {
            res.json(userProfile);
        } else {
            res.status(404).json({ error: 'User profile not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
