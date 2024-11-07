const db = require('../config/database');

class Post {
    static async create(postData) {
        try {
            const [result] = await db.execute(
                `INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)`,
                [
                    postData.user_id,
                    postData.content,
                    postData.image || null
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        try {
            const [rows] = await db.execute(
                `SELECT posts.*, user_profile.first_name, user_profile.last_name, user_profile.profile_picture 
                 FROM posts
                 JOIN user_profile ON posts.user_id = user_profile.id
                 ORDER BY posts.created_at DESC`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByUserId(userId) {
        try {
            const [rows] = await db.execute(
                `SELECT posts.*, user_profile.first_name, user_profile.last_name, user_profile.profile_picture 
                 FROM posts
                 JOIN user_profile ON posts.user_id = user_profile.id
                 WHERE posts.user_id = ?
                 ORDER BY posts.created_at DESC`,
                [userId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async delete(postId, userId) {
        try {
            await db.execute(`DELETE FROM posts WHERE post_id = ? AND user_id = ?`, [postId, userId]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async reactToPost(postId, userId, reactionType) {
        try {
            // Check if reaction already exists
            const [existingReaction] = await db.execute(
                `SELECT * FROM reactions WHERE post_id = ? AND user_id = ?`, 
                [postId, userId]
            );

            if (existingReaction.length > 0) {
                // Update reaction
                await db.execute(
                    `UPDATE reactions SET type = ? WHERE post_id = ? AND user_id = ?`, 
                    [reactionType, postId, userId]
                );
            } else {
                // Insert new reaction
                await db.execute(
                    `INSERT INTO reactions (post_id, user_id, type) VALUES (?, ?, ?)`, 
                    [postId, userId, reactionType]
                );
            }

            return true;
        } catch (error) {
            throw error;
        }
    }
}



module.exports = Post;
