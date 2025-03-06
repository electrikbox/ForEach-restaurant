const reservationsRouter = require('express').Router();
const reservationsController = require('../controllers/reservationsController');
const adminCheck = require('../middleware/adminCheck');

reservationsRouter.post('/', reservationsController.createReservation);
reservationsRouter.get('/:id', reservationsController.getReservation);
reservationsRouter.get('/user/:userId', reservationsController.getReservationsByUser);
reservationsRouter.delete('/:id', reservationsController.deleteReservation);
reservationsRouter.get('/', adminCheck, reservationsController.getAllReservations);
reservationsRouter.put('/:id', adminCheck, reservationsController.updateReservation);

module.exports = reservationsRouter;