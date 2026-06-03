const jwt = require('jsonwebtoken');

// Checkpoint 1: Verify if the user is logged in with a valid token
const verifyToken = (req, res, next) => {
    // Extract token from the HTTP Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expects "Bearer <TOKEN>"

    // If no token is attached, reject immediately with a clean 401 status
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Decrypt and verify token signature using our secret passphrase
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request object so future steps can read it
        req.user = decoded;

        // Pass control to the next function in line
        next();
    } catch (error) {
        // If the token was altered, tampered with, or expired, return an explicit 401
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// Checkpoint 2: Verify if the logged-in user is an administrator
const requireAdmin = (req, res, next) => {
    // Read req.user attached by verifyToken and evaluate their system role
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // Return a 403 Forbidden error if a regular student tries to touch admin code
        return res.status(403).json({ message: 'Access forbidden. Admin role required.' });
    }
};

module.exports = { verifyToken, requireAdmin };
