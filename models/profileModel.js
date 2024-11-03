// models/profileModel.js
const db = require('../config/database');

class ProfileInfo {
    static async create(profileData) {
        try {
            const [result] = await db.execute(
                `INSERT INTO profile_info (
                    user_id, profile_picture_url, resume_url,
                    batch_year, branch
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    profileData.user_id,
                    profileData.profile_picture_url,
                    profileData.resume_url,
                    profileData.batch_year,
                    profileData.branch
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findByUserId(userId) {
        try {
            // Get profile info
            const [profileRows] = await db.execute(
                'SELECT * FROM profile_info WHERE user_id = ?',
                [userId]
            );

            // Get work experience
            const [experienceRows] = await db.execute(
                'SELECT * FROM work_experience WHERE user_id = ? ORDER BY start_date DESC',
                [userId]
            );

            // Get forums
            const [forumRows] = await db.execute(
                `SELECT f.* FROM forums f 
                 INNER JOIN user_forums uf ON f.forum_id = uf.forum_id 
                 WHERE uf.user_id = ?`,
                [userId]
            );

            return {
                profile: profileRows[0] || null,
                workExperience: experienceRows,
                forums: forumRows
            };
        } catch (error) {
            throw error;
        }
    }

    static async update(userId, profileData) {
        try {
            const [result] = await db.execute(
                `UPDATE profile_info SET 
                    profile_picture_url = COALESCE(?, profile_picture_url),
                    resume_url = COALESCE(?, resume_url),
                    batch_year = COALESCE(?, batch_year),
                    branch = COALESCE(?, branch)
                WHERE user_id = ?`,
                [
                    profileData.profile_picture_url,
                    profileData.resume_url,
                    profileData.batch_year,
                    profileData.branch,
                    userId
                ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async addWorkExperience(workData) {
        try {
            const [result] = await db.execute(
                `INSERT INTO work_experience (
                    user_id, company_name, position,
                    start_date, end_date, description
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    workData.user_id,
                    workData.company_name,
                    workData.position,
                    workData.start_date,
                    workData.end_date,
                    workData.description
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async joinForum(userId, forumId) {
        try {
            await db.execute(
                'INSERT INTO user_forums (user_id, forum_id) VALUES (?, ?)',
                [userId, forumId]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProfileInfo;