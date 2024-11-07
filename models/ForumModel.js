// models/ForumModel.js
const db = require('../config/database');

class Forum {
    // Create a new forum topic
    static async create(forumData) {
        try {
            const [result] = await db.execute(
                `INSERT INTO forum (title, no_of_users, admin_user_id) VALUES (?, ?, ?)`,
                [forumData.title, forumData.no_of_users || 0, forumData.admin_user_id]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Get all forums
    static async findAll() {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM forum ORDER BY title ASC`
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get a specific forum by ID
    static async findById(forumId) {
        try {
            const [rows] = await db.execute(
                `SELECT * FROM forum WHERE forum_id = ?`,
                [forumId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Delete a forum by ID
    static async delete(forumId) {
        try {
            await db.execute(`DELETE FROM forum WHERE forum_id = ?`, [forumId]);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Forum;
