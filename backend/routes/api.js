const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
    } catch (err) {
        console.error('Error in user registration:', err);
        if (err.code === '23505') { // unique_violation error code
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error in user login:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.userId;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Get user's scores
router.get('/scores', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM scores WHERE user_id = $1 ORDER BY date DESC',
            [req.userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error in /scores:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user's score
router.post('/update-score', verifyToken, async (req, res) => {
    try {
        const { score, game_mode } = req.body;
        const date = new Date();

        await pool.query(
            'INSERT INTO scores (user_id, score, date, game_mode) VALUES ($1, $2, $3, $4)',
            [req.userId, score, date, game_mode]
        );

        const result = await pool.query(
            'SELECT * FROM scores WHERE user_id = $1 ORDER BY date DESC',
            [req.userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error in /update-score:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Check if user has played today
router.get('/check-played', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM scores WHERE user_id = $1 AND date::date = CURRENT_DATE',
            [req.userId]
        );
        res.json({ played: result.rows.length > 0 });
    } catch (err) {
        console.error('Error in /check-played:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;