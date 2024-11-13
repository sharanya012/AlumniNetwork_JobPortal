const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.post('/signup', async (req, res) => {
    try {
        const existingUser  = await User.findByEmail(req.body.email);
        if (existingUser ) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        
        const userId = await User.create(req.body);
        req.session.userId = userId; // Set session
        console.log('User  signed up with ID:', userId); // Log the user ID

        res.json({
            success: true,
            message: 'Registration successful',
            redirect: `/profile/${userId}` // Use backticks for template literals
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during registration'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email });

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isValidPassword = await User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        req.session.userId = user.user_id; // Use user_id from user_login table
        console.log('User  logged in with ID:', user.user_id); // Log the user ID
        
        res.json({
            success: true,
            message: 'Login successful',
            redirect: `/profile/${user.user_id}` // Use backticks for template literals
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login'
        });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({
        success: true,
        redirect: '/'
    });
});

module.exports = router;