const db = require('../config/database');

class Profile {
    static async getUserProfileById(userId) {
        try {
            const [rows] = await db.execute(
                `SELECT first_name, middle_name, last_name, user_type, 
                        work_experience, resume, profile_picture, 
                        email, phone_no, registration_date, 
                        branch_name, year_of_graduation
                 FROM all_users_info
                 WHERE user_id = ?`,
                [userId]
            );
            
            return rows[0]; // Return the user's profile information as an object
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Profile;
