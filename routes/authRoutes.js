// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.post('/signup', async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create new user
        const userId = await User.create(req.body);

        res.json({
            success: true,
            message: 'Registration successful',
            redirect: '/dashboard'
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
        console.log('Login attempt:', { email, password });  // Add this

        // Find user by email
        const user = await User.findByEmail(email);
        console.log('User found:', user);  // Add this

        if (!user) {
            console.log('No user found with this email');  // Add this
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isValidPassword = await User.verifyPassword(password, user.password_hash);
        console.log('Password verification result:', isValidPassword);  // Add this

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.json({
            success: true,
            message: 'Login successful',
            redirect: '/dashboard'
        });
    } catch (error) {
        console.error('Detailed login error:', error);  // Modified this
        res.status(500).json({
            success: false,
            message: 'An error occurred during login'
        });
    }
});

module.exports = router;