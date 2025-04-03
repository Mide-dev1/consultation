const express = require('express');
const router = express.Router();

router.options('/test', (req, res) => {
    res.status(200).end();
});

router.get('/test', (req, res) => {
    res.json({ message: 'CORS is working' });
});

module.exports = router;
