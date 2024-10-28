const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    try {
        console.log(firstname, lastname, email, password)
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const user = await User.create({ firstname, lastname, email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const requestPasswordReset = async (req, res) => {
    console.log('reset')
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate a 6-digit reset key
        const resetKey = crypto.randomInt(100000, 999999).toString();

        // Set the reset key and expiration (e.g., 1 hour)
        user.resetKey = resetKey;
        user.resetKeyExpiration = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send reset key via email
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use any service (Gmail, etc.)
            auth: {
                user: process.env.EMAIL, // Your email
                pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Key',
            text: `Your password reset key is ${resetKey}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset key sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reset password using the reset key
const resetPassword = async (req, res) => {
    const { email, resetKey, newPassword } = req.body;
    try {
        const user = await User.findOne({ email, resetKey });
        if (!user) return res.status(404).json({ message: 'Invalid reset key or user not found' });

        // Check if the reset key has expired
        if (user.resetKeyExpiration < Date.now()) {
            return res.status(400).json({ message: 'Reset key expired' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password
        user.password = newPassword;
        user.resetKey = undefined; // Remove the reset key after successful password reset
        user.resetKeyExpiration = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, achievement, about, phone, goal, skill } = req.body;
    try {
        // Create an update object and add the image URL if an image is uploaded
        const updateFields = { lastname, firstname, email, about, phone, achievement, goal, skill };
        if (req.file) {
            updateFields.image = req.file.location;  // S3 file URL from multer-s3
        }
        // Update the user with the new fields
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};

// const updateUser = async (req, res) => {
//     const { id } = req.params;
//     const { username, email } = req.body;

//     try {
//         const updatedUser = await User.findByIdAndUpdate(id, { username, email }, { new: true, runValidators: true });
//         if (!updatedUser) return res.status(404).json({ message: 'User not found' });

//         res.status(200).json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to update user', error: error.message });
//     }
// };
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};


module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    requestPasswordReset,
    resetPassword,
};
