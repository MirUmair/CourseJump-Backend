const express = require('express');
const { registerUser, loginUser, updateUser, deleteUser, resetPassword, requestPasswordReset } = require('../controllers/userController');
const router = express.Router();


// Define routes
router.post('/register', registerUser);         // Register a new user
router.post('/login', loginUser);               // Login a user
router.put('/:id', updateUser);                 // Update user by ID
router.delete('/:id', deleteUser);              // Delete user by ID
router.post('/requestReset', requestPasswordReset);
router.post('/reset', resetPassword);
module.exports = router;
