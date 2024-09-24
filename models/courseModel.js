const mongoose = require('mongoose');

const obstacleSchema = new mongoose.Schema({
    fenceType: String,
    line: String,
    riderNotes: String,
    strides: String
});

const courseSchema = new mongoose.Schema({
    courseDesigner: String,
    userId: String,
    courseImage: String,
    date: String,
    name: String,
    obstacles: [obstacleSchema],
    timeAllowed: String,
    venue: String,
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true } // Reference to Tournament
});

module.exports = mongoose.model('Course', courseSchema);
