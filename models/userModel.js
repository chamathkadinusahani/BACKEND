const connection = require('../config/dbConfig');

const User = {
    create: (userData, callback) => {
        const query = 'INSERT INTO users (firstName, lastName, studentId, password) VALUES (?, ?, ?, ?)';
        connection.query(query, userData, callback);
    },

    findByStudentId: (studentId, callback) => {
        const query = 'SELECT * FROM users WHERE studentId = ?';
        connection.query(query, [studentId], callback);
    }
};

module.exports = User;
