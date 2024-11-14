const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'M@halakshmi234',
    database: process.env.DB_NAME || 'alumni_portal'
});

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    key: 'session_cookie_name',
    secret: 'your-secret-key', // Use a secure secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
}));

// Authentication middleware
const authenticateUser = (req, res, next) => {
    if (req.session.userId) {
        next(); // If session exists, proceed to the next middleware/route
    } else {
        res.redirect('/'); // Redirect to the login page if no session
    }
};

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);
const postsRoutes = require('./routes/postsRoutes'); 
app.use('/api/posts', postsRoutes);
const forumRoutes = require('./routes/forumRoutes'); 
app.use('/api/forums', forumRoutes);


// Serve Pages (HTML Files)
// Profile page
app.get('/profile/:id', authenticateUser, async (req, res) => {
    const userId = req.params.id;
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});


// Posts page
app.get('/posts', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'posts.html'));
});

// Forums page
app.get('/forums', authenticateUser, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'forums.html'));
});

// Default route (could be homepage or login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
