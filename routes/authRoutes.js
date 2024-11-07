const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        
        const userId = await User.create(req.body);
        req.session.userId = userId; // Set session

        res.json({
            success: true,
            message: 'Registration successful',
            redirect: '/profile'
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
        
        res.json({
            success: true,
            message: 'Login successful',
            redirect: '/profile'
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