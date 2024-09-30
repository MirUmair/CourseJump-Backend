const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    const { username, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, email }, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};
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
    deleteUser
};
