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
app.use(cors({origin: "http://localhost:3000", credentials: true}));

app.get("/", authenticateToken, (req, res) => {
    const email = req.user.email;

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Error fetching posts");
        }

        res.json(results);
    });
});

app.post('/postjob', async (req, res) => {
    const { title, description, points, email } = req.body;

    try {
        const query = 'INSERT INTO jobs (title, job_description, points_asked, user_email) VALUES (?, ?, ?, ?)';
        db.query(query, [title, description, points, email], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(201).json({ message: 'job added successfully' });
        });
    } catch (error) {
        res.status(500).send('error submitting job user');
    }
});

app.post('/addskill', async (req, res) => {
    const { email, skill } = req.body;

    try {
        const query = 'UPDATE users SET skills = CONCAT(IFNULL(skills, ""), ?, ",") WHERE email = ?';
        db.query(query, [skill, email], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(201).json({ message: 'skill added successfully' });
        });
    } catch (error) {
        res.status(500).send('Error submitting skill');
    }
});

app.post("/getskills", (req, res) => {
    const { email } = req.body;

    try {
        const query = 'SELECT skills FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                throw err;
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).send('Error submitting skill');
    }
});

app.post("/getjobs", (req, res) => {
    const { email } = req.body;

    try {
        const query = 'SELECT * FROM jobs WHERE user_email != ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                throw err;
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).send('Error displaying jobs');
    }
});


function authenticateToken(req, res, next)  {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

app.listen(3001, () => {
    console.log("Server running on port 3001");
});