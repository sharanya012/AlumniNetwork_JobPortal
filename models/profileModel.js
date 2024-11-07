// models/profileModel.js
const db = require('../config/database');

class Profile {
    static async getUserProfileById(userId) {
        try {
            const [rows] = await db.execute(
                `SELECT up.first_name, up.middle_name, up.last_name,
                        bf.branch_name, bf.year_of_graduation
                 FROM User_profile up
                 JOIN Batch_branch_forum bf ON bf.branch_name = up.branch_name
                 WHERE up.user_id = ?`,
                [userId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Profile;
