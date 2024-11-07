// routes/forumRoutes.js
const express = require('express');
const Forum = require('../models/ForumModel');  // Import Forum model
const router = express.Router();

// Route to fetch all forums
router.get('/forums', async (req, res) => {
    try {
        const forums = await Forum.findAll();
        res.json(forums);  // Send all forums to the frontend
    } catch (error) {
        console.error('Error fetching forums:', error);
        res.status(500).json({ message: 'Error fetching forums' });
    }
});

// Route to create a new forum
router.post('/forums', async (req, res) => {
    try {
        const forumId = await Forum.create(req.body);  // Assuming forum data comes from the request body
        res.json({ success: true, message: 'Forum created successfully', forumId });
    } catch (error) {
        console.error('Error creating forum:', error);
        res.status(500).json({ message: 'Error creating forum' });
    }
});

// Route to delete a forum
router.delete('/forums/:forumId', async (req, res) => {
    try {
        const success = await Forum.delete(req.params.forumId);
        if (success) {
            res.json({ success: true, message: 'Forum deleted successfully' });
        } else {
            res.status(404).json({ message: 'Forum not found' });
        }
    } catch (error) {
        console.error('Error deleting forum:', error);
        res.status(500).json({ message: 'Error deleting forum' });
    }
});

module.exports = router;
