// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    // Bypass authentication for the login route
    if (req.path === '/api/login') {
        return next();
    }

    // Validate and verify JWT token for other routes
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token without 'Bearer' prefix
    if (!token) {
        console.log('Token not found.');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, { complete: true }, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = decoded.payload;
        next();
    });
};

module.exports = authenticateJWT;
