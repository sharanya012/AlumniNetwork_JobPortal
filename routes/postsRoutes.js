// postRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');
const Post = require('../models/postModel');
const router = express.Router();

// Rate limiting for reactions
const reactionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/posts');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG and GIF are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Transform post data for frontend
const transformPost = (post) => ({
    id: post.post_id,
    authorName: `${post.first_name} ${post.last_name}`,
    authorAvatar: post.profile_picture,
    content: post.content,
    image: post.image,
    createdAt: post.created_at,
    isMine: Boolean(post.is_mine),
    userLiked: post.user_reaction === 'like',
    userDisliked: post.user_reaction === 'dislike',
    likes: parseInt(post.likes || 0),
    dislikes: parseInt(post.dislikes || 0)
});

// Get posts
router.get('/', async (req, res) => {
    const { type } = req.query;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        let posts;
        if (type === 'my') {
            posts = await Post.findByUserIdWithDetails(userId, userId);
        } else {
            posts = await Post.findAllWithDetails(userId);
        }
        res.json(posts.map(transformPost));
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, message: 'Error fetching posts' });
    }
});

// Search posts
router.get('/search', async (req, res) => {
    const { username } = req.query;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        if (!username) {
            return res.status(400).json({ success: false, message: 'Username parameter is required' });
        }
        
        const posts = await Post.findByUsernameWithDetails(username, userId);
        res.json(posts.map(transformPost));
    } catch (error) {
        console.error('Search posts error:', error);
        res.status(500).json({ success: false, message: 'Failed to search posts' });
    }
});

// Create post
router.post('/', upload.single('image'), async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const content = sanitizeHtml(req.body.content, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a'],
            allowedAttributes: {
                'a': ['href']
            }
        });

        if (!content) {
            return res.status(400).json({ success: false, message: 'Content is required' });
        }

        const image = req.file ? `/uploads/posts/${req.file.filename}` : null;

        const postId = await Post.create({
            user_id: req.session.userId,
            content,
            image
        });

        res.json({ success: true, message: 'Post created successfully', postId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, message: 'Error creating post' });
    }
});

// Delete post
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
        res.status(500).json({ success: false, message: 'Error deleting post' });
    }
});

// React to post
router.post('/:postId/react', reactionLimiter, async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const { postId } = req.params;
        const { reaction_type } = req.body;

        if (!reaction_type || !['like', 'dislike'].includes(reaction_type)) {
            return res.status(400).json({ success: false, message: 'Invalid reaction type' });
        }

        await Post.reactToPost(postId, req.session.userId, reaction_type);
        res.json({ success: true, message: 'Reaction saved successfully' });
    } catch (error) {
        console.error('Error reacting to post:', error);
        res.status(500).json({ success: false, message: 'Error reacting to post' });
    }
});

module.exports = router;