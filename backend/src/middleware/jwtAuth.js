const jwt = require('jsonwebtoken');



const jwtAuth = async (req, res, next) => {

    // Get token from header
    let token = req.headers.authorization;
    if (!token && req.cookies && req.cookies.token) token = req.cookies.token;
    
    // Check if no token
    if (!token) return res.status(401).json({ error: 'Token not found' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      next();
    } catch (err) {
        console.error(err);
        return res.status(403).json('Not Authorized');
    }
};

module.exports = jwtAuth;
