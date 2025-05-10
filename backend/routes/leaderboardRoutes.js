const express = require('express');
const router = express.Router();

const leaderboardController = require('../controllers/leaderboardController');
const authenticate = require('../middleware/auth');

router.get('/premium/showleaderboard', authenticate, leaderboardController.showleaderboard );

module.exports = router;