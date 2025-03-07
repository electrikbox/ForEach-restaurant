const UsersService = require('../services/authService');



class UsersController {



    // register method
    // ========================================================================

    static register = async (req, res) => {
        try {
            const { username, email, password, role = 'user' } = req.body;

            const response = await UsersService.register(username, email, password, role);
            res.status(201).json(response);
            
        } catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({ message: error.message });
        }
    };

    

    // login method
    // =================================================================

    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            const response = await UsersService.login(email, password);

            res.cookie('token', response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000 // 1 hour
            });

            res.status(200).json({
                id: response.id,
                username: response.username,
                email: response.email,
                role: response.role
            });

        } catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({ message: error.message });
        }
    };



    // logout method
    // =================================================================

    static logout = (req, res) => {
        res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });

        res.status(200).json({ message: 'Logged out successfully' });
      };
}



module.exports = UsersController;