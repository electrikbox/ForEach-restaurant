const usersRouter = require('express').Router();
const UsersController = require('../controllers/authController');

usersRouter.post('/register', UsersController.register);
usersRouter.post('/login', UsersController.login);
usersRouter.get('/logout', UsersController.logout);

module.exports = usersRouter;