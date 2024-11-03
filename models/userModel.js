// models/userModel.js
const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            const [result] = await db.execute(
                `INSERT INTO users (
                    user_type, email, phone_number, password_hash,
                    first_name, middle_name, last_name,
                    graduation_year, branch_of_study
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userData.user_type,
                    userData.email,
                    userData.phone,
                    hashedPassword,
                    userData.first_name,
                    userData.middle_name || null,
                    userData.last_name,
                    userData.graduation_year,
                    userData.branch
                ]
            );
            
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;