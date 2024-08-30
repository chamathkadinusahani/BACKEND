const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: 'password', // replace with your MySQL password
  database: 'student_db' // replace with your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// JWT Secret
const jwtSecret = 'your_jwt_secret_key';

// Routes
app.post('/api/register', (req, res) => {
  const { firstName, lastName, studentId, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (first_name, last_name, student_id, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [firstName, lastName, studentId, hashedPassword], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'User registered successfully!' });
  });
});

app.post('/api/login', (req, res) => {
  const { studentId, password } = req.body;

  const sql = 'SELECT * FROM users WHERE student_id = ?';
  db.query(sql, [studentId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(400).send({ message: 'Invalid student ID or password' });

    const user = results[0];

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(400).send({ message: 'Invalid student ID or password' });

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

    res.status(200).send({ token });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
