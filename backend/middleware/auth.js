const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (userId, username) => {
    const token = jwt.sign({
        id: userId,
        username: username
    }, JWT_SECRET, {
        expiresIn: '24h'
    })

    return token;
}

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            error: 'Access denied'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;

        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            error: 'Invalid token'
        });
    }
}

module.exports = {
    createToken,
    verifyToken,
};