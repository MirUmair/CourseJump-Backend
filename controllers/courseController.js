const Course = require('../models/courseModel');
const jwt = require('jsonwebtoken');
// const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// // Configure AWS SDK with credentials and region
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION  // e.g., 'us-east-1'
// });

// Create S3 instance
// const s3 = new AWS.S3();
const { S3Client } = require('@aws-sdk/client-s3');

// Configure AWS SDK with credentials
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Update multer-s3 with AWS SDK v3 setup

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + path.extname(file.originalname));  // File name with timestamp
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
    fileFilter: (req, file, cb) => {
        // Updated file types to include more image formats
        const fileTypes = /jpeg|jpg|png|gif|bmp|tiff|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true);
        } else {
            cb('Error: Only image files are allowed!');
        }
    }
});


const createCourse = async (req, res) => {
    try {
        // Check if an image is uploaded and add its S3 URL to the course data
        let courseData = { ...req.body };
        if (req.file) {
            courseData.courseImage = req.file.location;  // S3 file URL from multer-s3
        }

        // Parse obstacles if sent as JSON
        if (req.body.obstacles) {
            courseData.obstacles = JSON.parse(req.body.obstacles);
        }

        // Create the course with the image URL and other data
        const course = await Course.create(courseData);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create course', error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();  // Fetch all courses
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;  // Get course ID
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
        const token = req.headers.authorization?.split(' ')[1];  // Extract token from headers

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const courses = await Course.find({ userId });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this user' });
        }

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;  // Get course ID
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete course', error: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;  // Get course ID
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);
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
