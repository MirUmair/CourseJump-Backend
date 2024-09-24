const express = require('express');
const router = express.Router();
const { createTournament } = require('../controllers/tournamentController');

// Create tournament
router.post('/create', createTournament);

module.exports = router;
