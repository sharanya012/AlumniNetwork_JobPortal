const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            // Start a transaction
            await db.query('START TRANSACTION');

            const [batchResult] = await db.execute(
                `INSERT INTO Batch_branch_forum (
                    branch_name, year_of_graduation
                ) VALUES (?, ?)`,
                [
                    userData.branch,
                    userData.graduation_year
                ]
            );
            
            // Insert into User_profile
            const [profileResult] = await db.execute(
                `INSERT INTO User_profile (
                    first_name, middle_name, last_name, user_type, 
                    work_experience, resume, profile_picture
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    userData.first_name,
                    userData.middle_name || null,
                    userData.last_name,
                    userData.user_type,
                    userData.work_experience || null,
                    userData.resume || null,
                    userData.profile_picture || null
                ]
            );

            // Insert into User_login using the user_id from User_profile
            const userId = profileResult.insertId;
            await db.execute(
                `INSERT INTO User_login (
                    user_id, email, password, phone_no, registration_date, user_type
                ) VALUES (?, ?, ?, ?, NOW(), ?)`,
                [
                    userId,
                    userData.email,
                    hashedPassword,
                    userData.phone,
                    userData.user_type
                ]
            );

            // Commit the transaction
            await db.query('COMMIT');

            return userId;
        } catch (error) {
            // Rollback in case of an error
            await db.query('ROLLBACK');
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await db.execute(
                `SELECT up.*, ul.email, ul.password, ul.phone_no, ul.registration_date, ul.user_type 
                FROM User_profile up
                JOIN User_login ul ON up.user_id = ul.user_id
                WHERE ul.email = ?`,
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        console.log("Plain Password:", plainPassword);   // For debugging
        console.log("Hashed Password:", hashedPassword); // For debugging
        
        if (!plainPassword || !hashedPassword) {
            throw new Error("Password and hash are required");
        }

        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute(
                `SELECT up.*, ul.email, ul.phone_no, ul.registration_date, ul.user_type 
                FROM User_profile up
                JOIN User_login ul ON up.user_id = ul.user_id
                WHERE up.user_id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
