const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            // Start a transaction
            await db.query('START TRANSACTION');

            const [result] = await db.execute(
                `INSERT INTO all_users_info (
                    first_name, middle_name, last_name, user_type, 
                    work_experience, resume, profile_picture, 
                    email, password, phone_no, registration_date, 
                    branch_name, year_of_graduation
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
                [
                    userData.first_name,
                    userData.middle_name || null,
                    userData.last_name,
                    userData.user_type,
                    userData.work_experience || null,
                    userData.resume || null,
                    userData.profile_picture || null,
                    userData.email,
                    hashedPassword,
                    userData.phone,
                    userData.branch,
                    userData.graduation_year
                ]
            );

            return result.insertId;

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
                `SELECT * FROM all_users_info WHERE email = ?`,
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
                `SELECT * FROM all_users_info WHERE user_id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
