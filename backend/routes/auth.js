const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/schema');

// POST API for handling Login requests
router.post('/login', async (req, res) => {
    const { username, password, name, role } = req.body;

    try {
        // 1. Validation check
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // 2. Find the user in the database
        let user = await User.findOne({ username });

        // 3. Handle auto-registration if the user doesn't exist yet
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                username,
                password: hashedPassword,
                name: name || 'New Student',
                role: role || 'user'
            });
            await user.save();
        } else {
            // 4. Verify password for existing users
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
        }

        // 5. Generate secure token session
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // 6. Return the clean token session to the frontend
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, role: user.role, name: user.name }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// THIS LINE CURES THE ERROR: It exports the function that server.js is looking for!
module.exports = router;
