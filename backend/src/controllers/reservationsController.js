const ReservationsService = require('../services/reservationsService');



class ReservationsController {



    // create method
    // ========================================================================

    static createReservation = async (req, res) => {
        try {
            const { user, dateDebut, dateFin } = req.body;
            const response = await ReservationsService.createReservation(user, dateDebut, dateFin);
            res.status(201).json(response);
            
        } catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({ message: error.message });
        }
    };


    // login method
    // =================================================================

    static getReservation = async (req, res) => {
        try {
            const { id } = req.params;
            const response = await ReservationsService.getReservation(id);
            res.status(200).json(response);

        } catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({ message: error.message });
        }
    };



    // get all reservations by user
    // =================================================================

    static getReservationsByUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const response = await ReservationsService.getReservationsByUser(userId);
            res.status(200).json(response);

        } catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({ message: error.message });
        }
    }



    // update method
    // =================================================================

    static updateReservation = async (req, res) => {
        try {
            const { id } = req.params;
            const { user, dateDebut, dateFin, validated, sentEmail } = req.body;
            const response = await ReservationsService.updateReservation(id, user, dateDebut, dateFin, validated, sentEmail);
            res.status(200).json(response);

            console.log('Reservation updated:', response);

        } catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({ message: error.message });
        }
    };


    // delete method
    // =================================================================

    static deleteReservation = async (req, res) => {
        try {
            const { id } = req.params;
            const response = await ReservationsService.deleteReservation(id);
            res.status(200).json(response);

        } catch (error) {
            const statusCode = error.statusCode || 400;
            res.status(statusCode).json({ message: error.message });
        }
    };
}



module.exports = ReservationsController;