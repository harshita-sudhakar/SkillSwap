//import users from "./user.js";
require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const jwt = require("jsonwebtoken");
const db = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());

let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) {
        res.sendStatus(401)
    }
    if (!refreshTokens.includes(refreshToken)) {
        res.sendStatus(403)
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = generateAccessToken({email: user.email});
        res.json({accessToken: accessToken})
    });
});

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token != req.body.token)
    res.sendStatus(204);
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const accessToken = generateAccessToken(user);
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                refreshTokens.push(refreshToken);
                res.json({accessToken: accessToken, refreshToken: refreshToken});
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(404).send('User not found');
        }
    });
});

app.post('/register', async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)';
        db.query(query, [name, email, username, hashedPassword], (err, result) => {
            if (err) throw err;
            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
}

app.listen(4001, () => {
    console.log("Server running on port 4001");
});
