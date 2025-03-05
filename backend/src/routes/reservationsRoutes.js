const reservationsRouter = require('express').Router();
const reservationsController = require('../controllers/reservationsController');
// const adminCheck = require('../middleware/adminCheck');

reservationsRouter.post('/', reservationsController.createReservation);
reservationsRouter.get('/:id', reservationsController.getReservation);
reservationsRouter.get('/user/:userId', reservationsController.getReservationsByUser);
reservationsRouter.put('/:id', reservationsController.updateReservation);
reservationsRouter.delete('/:id', reservationsController.deleteReservation);

module.exports = reservationsRouter;