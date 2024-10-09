const express = require('express');

const { createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
    getCourseById,
    getCoursesByUser, upload } = require('../controllers/courseController');
const router = express.Router();

// Define routes
router.post('/create', upload.single('courseImage'), createCourse);

router.get('/', getAllCourses);                    // GET all courses
router.get('/:id', getCourseById);                 // GET a course by ID
// router.post('/', createCourse);                    // POST a new course
// router.put('/:id', updateCourse);                  // PUT (update) a course by ID
router.put('/update/:id', upload.single('courseImage'), updateCourse);

router.delete('/:id', deleteCourse);               // DELETE a course by ID
router.get('/user/token', getCoursesByUser);

module.exports = router;
