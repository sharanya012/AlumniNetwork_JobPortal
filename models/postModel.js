// postModel.js
const db = require('../config/database');

class Post {
    static async create(postData) {
        try {
            const [result] = await db.execute(
                `INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)`,
                [postData.user_id, postData.content, postData.image || null]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findAllWithDetails(currentUserId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    p.*,
                    up.first_name,
                    up.last_name,
                    up.profile_picture,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.post_id AND type = 'like') as likes,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.post_id AND type = 'dislike') as dislikes,
                    (SELECT type FROM reactions WHERE post_id = p.post_id AND user_id = ?) as user_reaction,
                    p.user_id = ? as is_mine
                FROM posts p
                JOIN user_profile up ON p.user_id = up.user_id
                ORDER BY p.created_at DESC
            `, [currentUserId, currentUserId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByUserIdWithDetails(userId, currentUserId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    p.*,
                    up.first_name,
                    up.last_name,
                    up.profile_picture,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.post_id AND type = 'like') as likes,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.post_id AND type = 'dislike') as dislikes,
                    (SELECT type FROM reactions WHERE post_id = p.post_id AND user_id = ?) as user_reaction,
                    p.user_id = ? as is_mine
                FROM posts p
                JOIN user_profile up ON p.user_id = up.user_id
                WHERE p.user_id = ?
                ORDER BY p.created_at DESC
            `, [currentUserId, currentUserId, userId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async findByUsernameWithDetails(username, currentUserId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    p.*,
                    up.first_name,
                    up.last_name,
                    up.profile_picture,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.post_id AND type = 'like') as likes,
                    (SELECT COUNT(*) FROM reactions WHERE post_id = p.post_id AND type = 'dislike') as dislikes,
                    (SELECT type FROM reactions WHERE post_id = p.post_id AND user_id = ?) as user_reaction,
                    p.user_id = ? as is_mine
                FROM posts p
                JOIN user_profile up ON p.user_id = up.user_id
                WHERE CONCAT(up.first_name, ' ', up.last_name) LIKE ?
                ORDER BY p.created_at DESC
            `, [currentUserId, currentUserId, `%${username}%`]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async delete(postId, userId) {
        try {
            const [result] = await db.execute(
                `DELETE FROM posts WHERE post_id = ? AND user_id = ?`,
                [postId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async reactToPost(postId, userId, reactionType) {
        try {
            await db.execute(
                `INSERT INTO reactions (post_id, user_id, type) 
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE type = ?`,
                [postId, userId, reactionType, reactionType]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Post;