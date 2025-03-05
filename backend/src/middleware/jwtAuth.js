const jwt = require('jsonwebtoken');



const jwtAuth = async (req, res, next) => {
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
      next();
    } catch (err) {
        console.error(err);
        return res.status(403).json('Not Authorized');
    }
};

module.exports = jwtAuth;
