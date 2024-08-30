const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.register = (req, res) => {
    const { firstName, lastName, studentId, password } = req.body;

    // Hash the password before saving it
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        const userData = [firstName, lastName, studentId, hash];

        User.create(userData, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
};

exports.login = (req, res) => {
    const { studentId, password } = req.body;

    User.findByStudentId(studentId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = results[0];

        // Compare the password with the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            res.status(200).json({ message: 'Login successful' });
        });
    });
};
