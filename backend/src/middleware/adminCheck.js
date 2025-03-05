const jwt = require('jsonwebtoken');



const adminCheck = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token && req.cookies && req.cookies.token)
        token = req.cookies.token;
    
    if (!token) {
        res.status(401).json({ error: 'Token not found' });
        return;
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (req.user.role !== 'admin') {
            res.status(403).json('Only admin can access this route');
            return;
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json('Not Authorized');
    }
};

module.exports = adminCheck;
