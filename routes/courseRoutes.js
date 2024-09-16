const express = require('express');
const { createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
    getCourseById } = require('../controllers/courseController');
const router = express.Router();

// Define routes
router.get('/', getAllCourses);                    // GET all courses
router.get('/:id', getCourseById);                 // GET a course by ID
router.post('/', createCourse);                    // POST a new course
router.put('/:id', updateCourse);                  // PUT (update) a course by ID
router.delete('/:id', deleteCourse);               // DELETE a course by ID

module.exports = router;
