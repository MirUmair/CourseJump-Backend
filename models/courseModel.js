const mongoose = require('mongoose');

const obstacleSchema = new mongoose.Schema({
    fenceType: String,
    line: String,
    riderNotes: String,
    strides: String
});

const courseSchema = new mongoose.Schema({
    courseDesigner: String,
    courseImage: String,
    date: String,
    name: String,
    obstacles: [obstacleSchema],
    timeAllowed: String,
    venue: String
});

module.exports = mongoose.model('Course', courseSchema);
