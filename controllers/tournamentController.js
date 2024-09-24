const Tournament = require('../models/tournamentModal');

const createTournament = async (req, res) => {
    try {
        const tournament = await Tournament.create(req.body);
        res.status(201).json(tournament);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create tournament', error: error.message });
    }
};

module.exports = {
    createTournament
};
