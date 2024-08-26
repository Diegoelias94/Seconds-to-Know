const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get user's scores
router.get('/scores/:username', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM scores WHERE username = $1 ORDER BY date DESC',
            [req.params.username]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update user's score
router.post('/update-score/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { score } = req.body;
        const date = new Date();

        await pool.query(
            'INSERT INTO scores (username, score, date) VALUES ($1, $2, $3)',
            [username, score, date]
        );

        const result = await pool.query(
            'SELECT * FROM scores WHERE username = $1 ORDER BY date DESC',
            [username]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Check if user has played today
router.get('/check-played/:username', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM scores WHERE username = $1 AND date::date = CURRENT_DATE',
            [req.params.username]
        );
        res.json({ played: result.rows.length > 0 });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;