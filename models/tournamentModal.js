const mongoose = require('mongoose');

// Tournament schema definition
const tournamentSchema = new mongoose.Schema({
   
    name: String,
    description: String,
    location: String,
    date: String,
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date of the tournament
    }
 });
 

// Export the Tournament model
module.exports = mongoose.model('Tournament', tournamentSchema);
