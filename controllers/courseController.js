const Course = require('../models/courseModel');

const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configure multer to store images in a specific folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname); // Folder where the images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // File name will have a timestamp to avoid conflicts
    }
});

// Initialize multer with the storage configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit image size to 5MB
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png/; // Allow only image files
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb('Error: Only images are allowed!'); // Reject files that aren't images
        }
    }
});

const createCourse = async (req, res) => {
    try {
        // Check if an image is uploaded and add its path to the course data
        let courseData = { ...req.body };
        if (req.file) {
            courseData.courseImage = `/${req.file.filename}`;
        }
        // Parse obstacles if they are sent as JSON (sometimes sent as strings in form data)
        if (req.body.obstacles) {
            courseData.obstacles = JSON.parse(req.body.obstacles);
        }
        // Create the course with the image path and other data
        const course = await Course.create(courseData);
        res.status(201).json(course); // Send back the created course
    } catch (error) {
        res.status(500).json({ message: 'Failed to create course', error: error.message });
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
const getCoursesByUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Check the token

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        console.log(`UserID extracted from token: ${userId}`);

        const courses = await Course.find({ userId });
        console.log(`Courses fetched for user: ${courses}`);

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this user' });
        }

        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
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
    getCourseById,
    getCoursesByUser,
    upload
};
