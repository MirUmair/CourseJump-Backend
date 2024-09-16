const Course = require('../models/courseModel');

const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create course' });
    }
};
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();  // Fetch all courses from the database
        res.status(200).json(courses);        // Send the courses in the response
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;  // Get course ID from the request parameters
        const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(updatedCourse);  // Return the updated course
    } catch (error) {
        res.status(500).json({ message: 'Failed to update course', error: error.message });
    }
};
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;  // Get course ID from the request parameters
        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course deleted successfully' });  // Confirm deletion
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete course', error: error.message });
    }
};
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;  // Get course ID from the request parameters
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);  // Return the found course
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch course', error: error.message });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
    getCourseById
};
