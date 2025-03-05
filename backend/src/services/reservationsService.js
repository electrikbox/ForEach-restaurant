const Reservations = require('../models/Reservations');
const AppError = require('../utils/Errors');



class ReservationsService {



    // create method
    // ========================================================================

    static createReservation = async (user, dateDebut, dateFin) => {
        const maxReservations = parseInt(process.env.MAX_RESERVATIONS, 10);
        const newDateDebut = new Date(dateDebut);
        const newDateFin = new Date(dateFin);

        // Compter uniquement les réservations qui se chevauchent avec le créneau demandé
        const overlappingCount = await Reservations.countDocuments({
            dateDebut: { $lte: newDateFin },
            dateFin: { $gte: newDateDebut }
        });

        if (overlappingCount >= maxReservations)
            throw new AppError(400, "Il n'y a plus de place pour des réservations à cet horaire.");
        else
            console.log('Nombre de réservations:', overlappingCount);

        const existingReservation = await Reservations.findOne({
            user,
            dateDebut: { $lte: newDateFin },
            dateFin: { $gte: newDateDebut }
        });

        if (existingReservation) {
            throw new AppError(400, 'Une réservation existe déjà pour cet intervalle de temps.');
        }

        const newReservation = new Reservations({ user, dateDebut, dateFin });
        await newReservation.save();

        return newReservation;
    };



    // login method
    // =================================================================

    static getReservation = async (id) => {
        const reseration = await Reservations.findOne({ _id: id });
        if (!reseration) throw new AppError(404, 'Reseration not found');
        
        return reseration;
    };



    // get all reserations by user
    // =================================================================

    static getReservationsByUser = async (userId) => {
        const reserations = await Reservations.find({ user: userId });
        if (!reserations) throw new AppError(404, 'Reserations not found');

        return reserations;
    }



    // update method
    // =================================================================

    static updateReservation = async (id, user, date, valideted, sentEmail) => {
        const reseration = await Reservations.findOne({ _id: id });
        if (!reseration) throw new AppError(404, 'Reseration not found');

        reseration.user = user;
        reseration.date = date;
        reseration.validated = valideted;
        reseration.sentEmail = sentEmail;

        const response = await reseration.save();
        if (!response) throw new AppError(500, 'Error updating reseration');

        return response;
    };


    // delete method
    // =================================================================

    static deleteReservation = async (id) => {
        const reseration = await Reservations.findOne({ _id: id });
        if (!reseration) throw new AppError(404, 'Reseration not found');

        const response = await reseration.delete();
        if (!response) throw new AppError(500, 'Error deleting reseration');

        return response;
    };
}



module.exports = ReservationsService;