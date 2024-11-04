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
const upload = multer({ storage: storage });

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Create a new post
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const postData = {
            user_id: req.session.userId,
            content: req.body.content,
            image: req.file ? `/uploads/posts/${req.file.filename}` : null
        };

        const postId = await Post.create(postData);
        res.json({ success: true, message: 'Post created successfully', postId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
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

// React to a post (like/dislike)
router.post('/:postId/react', async (req, res) => {
    try {
        const { postId } = req.params;
        const { reactionType } = req.body;

        await Post.reactToPost(postId, req.session.userId, reactionType);
        res.json({ success: true, message: 'Reaction saved successfully' });
    } catch (error) {
        console.error('Error reacting to post:', error);
        res.status(500).json({ message: 'Error reacting to post' });
    }
});

module.exports = router;
