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
    const { title, description, points, email, name } = req.body;

    try {
        const query = 'INSERT INTO jobs (title, job_description, points_asked, user_email, name) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [title, description, points, email, name], (err, result) => {
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
        const query = 'SELECT * FROM jobs WHERE user_email != ? AND is_taken=0';
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

app.post("/getjobfromid", (req, res) => {
    const { id } = req.body;

    try {
        const query = 'SELECT * FROM jobs WHERE id=?';
        db.query(query, [id], (err, results) => {
            if (err) {
                throw err;
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).send('Error displaying jobs');
    }
});

app.post("/getuserfromemail", (req, res) => {
    const { email } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE email=?';
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


app.post("/getname", (req, res) => {
    const { email } = req.body;

    try {
        const query = 'SELECT name FROM users WHERE email = ?';
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

app.post('/transaction', async (req, res) => {
    const { giver_email, buyer_email, job_id } = req.body;

    try {
        const query = 'INSERT INTO transactions (giver_email, buyer_email, job_id) VALUES (?, ?, ?)';
        db.query(query, [giver_email, buyer_email, job_id], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(201).json({ message: 'transaction added successfully' });
        });
    } catch (error) {
        res.status(500).send('error submitting transaction');
    }
});

app.post('/pastjobs', async (req, res) => {
    const { email } = req.body;

    try {
        const query = 'SELECT * FROM jobs WHERE user_email = ? AND is_taken=1';
        db.query(query, [email], (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).send('error giving past jobs');
    }
});

/*app.post('/messages', (req, res) => {
    const { senderEmail, receiverEmail, content } = req.body;
    const query = `INSERT INTO messages (sender_email, receiver_email, content) VALUES (?, ?, ?)`;

    db.query(query, [senderEmail, receiverEmail, content], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId });
    });
});

app.get('/messages/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  const query = 'SELECT * FROM messages WHERE (sender_email = ? AND receiver_email = ?) OR (sender_email = ? AND receiver_email = ?) ORDER BY timestamp ASC';
  db.query(query, [user1, user2, user2, user1], (err, results) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});*/

app.post('/updatenumber', async (req, res) => {
    const { rate, email } = req.body;

    try {
        const query = 'UPDATE users SET rate = ? WHERE email = ?';
        db.query(query, [rate, email], (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).send('error giving past jobs');
    }
});

app.post('/updateratenumber', async (req, res) => {
    const { email } = req.body;

    try {
        const query = 'UPDATE users SET rateNumber = rateNumber+1 WHERE email = ?';
        db.query(query, [email], (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).send('error giving past jobs');
    }
});

app.post('/currentjobs', async (req, res) => {
    const { email } = req.body;

    try {
        const query = 'SELECT * FROM jobs WHERE user_email = ? AND is_taken=0';
        db.query(query, [email], (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).send('error giving past jobs');
    }
});

app.post('/purchasedjobs', async (req, res) => {
    const { email } = req.body;

    try {
        const query = 'SELECT * FROM transactions WHERE buyer_email = ?';
        db.query(query, [email], (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    } catch (error) {
        res.status(500).send('error giving past jobs');
    }
});


app.post('/updateistaken', async (req, res) => {
    const { id } = req.body;

    try {
        const query = 'UPDATE jobs SET is_taken=1 WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(201).json({ message: 'points subtracted successfully' });
        });
    } catch (error) {
        res.status(500).send('error subtracted points');
    }
});

app.post('/updatepoints', async (req, res) => {
    const { points, email } = req.body;

    try {
        const query = 'UPDATE users SET points = points - ? WHERE email = ?';
        db.query(query, [points, email], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(201).json({ message: 'points subtracted successfully' });
        });
    } catch (error) {
        res.status(500).send('error subtracted points');
    }
});

app.post('/earnpoints', async (req, res) => {
    const { points, email } = req.body;

    try {
        const query = 'UPDATE users SET points = points + ? WHERE email = ?';
        db.query(query, [points, email], (err, result) => {
            if (err) {
                throw err;
            }
            res.status(201).json({ message: 'points subtracted successfully' });
        });
    } catch (error) {
        res.status(500).send('error subtracted points');
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