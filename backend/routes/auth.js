const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/schema');

router.post('/login', async (req, res) => {
    const { username, password, name, role } = req.body;

    try {

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        let user = await User.findOne({ username });
        // Do not create users on login. Only allow existing seeded users to log in.
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );


        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, role: user.role, name: user.name }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
module.exports = router;
