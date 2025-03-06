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
        const reservation = await Reservations.findOne({ _id: id });
        if (!reservation) throw new AppError(404, 'Reseration not found');
        
        return reservation;
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

    static updateReservation = async (id, user, dateDebut, dateFin, validated, sentEmail) => {
        // Construire un objet de mise à jour uniquement avec les champs définis (non undefined)
        const update = {};
        if (user !== undefined) update.user = user;
        if (dateDebut !== undefined) update.dateDebut = dateDebut;
        if (dateFin !== undefined) update.dateFin = dateFin;
        if (validated !== undefined) update.validated = validated;
        if (sentEmail !== undefined) update.sentEmail = sentEmail;

        const existingReservation = await Reservations.findOne({
            user,
            dateDebut: { $lte: dateFin },
            dateFin: { $gte: dateDebut }
        });

        if (existingReservation && existingReservation._id.toString() !== id) {
            throw new AppError(400, 'Une réservation existe déjà pour cet intervalle de temps.');
        }

        const reservation = await Reservations.findOneAndUpdate(
            { _id: id },
            { $set: update },
            { new: true, runValidators: true }
        );

        if (!reservation) throw new AppError(404, 'Reservation not found');

        return reservation;
    };


    // delete method
    // =================================================================

    static deleteReservation = async (id) => {
        const response = await Reservations.deleteOne({ _id: id });
        if (!response) throw new AppError(500, 'Error deleting reservation');

        return response;
    };
}



module.exports = ReservationsService;