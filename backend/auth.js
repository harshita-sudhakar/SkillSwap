const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = 'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)';
        db.query(query, [name, email, username, hashedPassword], (err, result) => {
            if (err) throw err;
            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const accessToken = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET);
                res.json({accessToken: accessToken});
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(404).send('User not found');
        }
    });
});

/*router.post('/createjob', req, rest) => {
    const {title, description, points, email}
}*/

module.exports = router;