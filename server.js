const express = require('express');
const path = require('path');
const session = require('express-session'); // Add this package: npm install express-session
const app = express();


// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using https
}));


// Authentication middleware
const authenticateUser = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/');
    }
};

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);
const profileRoutes = require('./routes/profileRoutes');
app.use('/api', profileRoutes);
const postsRoutes = require('./routes/postsRoutes'); 
app.use('/api/posts', postsRoutes);


// Serve the profile page only to authenticated users
app.get('/profile', authenticateUser, (req, res) => {
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, 'public', 'profile.html'));
    } else {
        res.redirect('/');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
