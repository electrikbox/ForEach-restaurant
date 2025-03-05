const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/Errors');



class UsersService {



    // register method
    // ========================================================================

    static register = async (username, email, password, role) => {
        const user = new User({ username, email, password, role });
        if (!user) throw new AppError(500, 'Error creating user');

        user.password = await bcrypt.hash(password, 10);
        
        const response = await user.save();
        if (!response) throw new AppError(500, 'Error registering user');

        return response;
    };
    


    // login method
    // =================================================================

    static login = async (email, password) => {
        const user = await User.findOne({ email });
        if (!user) throw new AppError(404, 'User not found');
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new AppError(400, 'Invalid credentials');
        
        const payload = { id: user._id, username: user.username, email: user.email, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        if (!token) throw new AppError(500,'Error creating token');
        
        const loggedUser = { ...payload, token }; 
        
        return loggedUser;
    };
}



module.exports = UsersService;