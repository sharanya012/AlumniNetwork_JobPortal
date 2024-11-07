const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/postModel');  // Import Post model
const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/posts');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG and GIF are allowed!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get('/', async (req, res) => {
    const { type } = req.query;
    const userId = req.session.userId;

    try {
        let posts;
        if (type === 'my') {
            posts = await Post.findByUserId(userId);  // Fetch user's posts
        } else {
            posts = await Post.findAll();  // Fetch all posts
        }
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// POST create a new post
router.post('/', upload.single('image'), async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ success: false, message: 'Content is required' });
        }

        const image = req.file ? `/uploads/posts/${req.file.filename}` : null;

        const postData = {
            user_id: req.session.userId,
            content,
            image
        };

        const postId = await Post.create(postData);  // Create post in DB

        res.json({ success: true, message: 'Post created successfully', postId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, message: 'Error creating post' });
    }
});

// DELETE a post
router.delete('/:postId', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const { postId } = req.params;
        const success = await Post.delete(postId, req.session.userId);
        
        if (success) {
            res.json({ success: true, message: 'Post deleted successfully' });
        } else {
            res.status(403).json({ success: false, message: 'Unauthorized action' });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
});

// POST react to a post (like/dislike)
router.post('/:postId/react', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const { postId } = req.params;
        const { reactionType } = req.body;

        if (!reactionType) {
            return res.status(400).json({ success: false, message: 'Reaction type is required' });
        }

        await Post.reactToPost(postId, req.session.userId, reactionType);
        res.json({ success: true, message: 'Reaction saved successfully' });
    } catch (error) {
        console.error('Error reacting to post:', error);
        res.status(500).json({ message: 'Error reacting to post' });
    }
});

module.exports = router;
