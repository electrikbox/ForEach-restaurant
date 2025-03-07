const Reservations = require('../models/Reservations');
const AppError = require('../utils/Errors');
const sendEmail = require('../utils/sendEmail');



class ReservationsService {



    // create method
    // ========================================================================

    static createReservation = async (user, dateDebut, dateFin, nbPersonnes) => {
        const maxReservations = parseInt(process.env.MAX_RESERVATIONS, 10);
        const newDateDebut = new Date(dateDebut);
        const newDateFin = new Date(dateFin);
      
        // Récupérer toutes les réservations qui se chevauchent avec l'intervalle demandé
        const overlappingReservations = await Reservations.find({
            dateDebut: { $lte: newDateFin },
            dateFin: { $gte: newDateDebut }
        });
      
        // Calculer le nombre total de personnes déjà réservées sur cet intervalle
        const totalReserved = overlappingReservations.reduce(
            (sum, reservation) => sum + (reservation.nbPersonnes || 0), 0
        );
      
        // Si l'ajout du nouveau nbPersonnes dépasse la capacité maximale, rejeter la réservation
        if (totalReserved + nbPersonnes > maxReservations)
            throw new AppError(400, "Il n'y a plus de place pour des réservations à cet horaire.");
      
        // Optionnel : Vérifier si l'utilisateur a déjà une réservation dans cet intervalle
        const existingReservation = await Reservations.findOne({
            user,
            dateDebut: { $lte: newDateFin },
            dateFin: { $gte: newDateDebut }
        }).populate('user');

        // Si une réservation existe déjà pour cet intervalle, rejeter la réservation
        if (existingReservation)
            throw new AppError(400, 'Une réservation existe déjà pour cet intervalle de temps.');
      
        // Créer et sauvegarder la nouvelle réservation en incluant le nombre de personnes
        const newReservation = new Reservations({ user, dateDebut, dateFin, nbPersonnes });
        await newReservation.save();

        // Envoi d'un email de confirmation
        await newReservation.populate('user');

        const subject = 'Confirmation reservation';
        const htmlContent = `
            <p>Bonjour ${newReservation.user.username}</p>
            <p>Votre reservation pour ${newReservation.nbPersonnes} personne(s) est confirmée: ${newReservation.dateDebut}</p>`
        ;
        await sendEmail(newReservation.user.email, subject, htmlContent);

        return newReservation;
    };



    // get reservation
    // =================================================================

    static getReservation = async (id) => {
        const reservation = await Reservations.findOne({ _id: id }).populate('user');
        if (!reservation) throw new AppError(404, 'Reseration not found');
        
        return reservation;
    };



    // get all reserations
    // =================================================================

    static getAllReservations = async () => {
        const reserations = await Reservations.find().populate('user');
        if (!reserations) throw new AppError(404, 'Reserations not found');

        return reserations;
    }



    // get all reserations by user
    // =================================================================

    static getReservationsByUser = async (userId) => {
        const reserations = await Reservations.find({ user: userId }).populate('user');
        if (!reserations) throw new AppError(404, 'Reserations not found');

        return reserations;
    }



    // update method
    // =================================================================

    static updateReservation = async (id, user, dateDebut, dateFin, validated, sentEmail, nbPersonnes) => {
        // Construire un objet de mise à jour uniquement avec les champs définis (non undefined)
        const update = {};
        if (user !== undefined) update.user = user;
        if (dateDebut !== undefined) update.dateDebut = dateDebut;
        if (dateFin !== undefined) update.dateFin = dateFin;
        if (validated !== undefined) update.validated = validated;
        if (sentEmail !== undefined) update.sentEmail = sentEmail;
        if (nbPersonnes !== undefined) update.nbPersonnes = nbPersonnes;

        // Vérifier si la nouvelle réservation chevauche une réservation existante
        const existingReservation = await Reservations.findOne({
            user,
            dateDebut: { $lte: dateFin },
            dateFin: { $gte: dateDebut }
        });

        // Si une réservation existe déjà pour cet intervalle, rejeter la mise à jour
        if (existingReservation && existingReservation._id.toString() !== id) {
            throw new AppError(400, 'Une réservation existe déjà pour cet intervalle de temps.');
        }

        // Mettre à jour la réservation
        const reservation = await Reservations.findOneAndUpdate(
            { _id: id },
            { $set: update },
            { new: true, runValidators: true }
        ).populate('user');

        // Si la réservation n'existe pas, renvoyer une erreur
        if (!reservation) throw new AppError(404, 'Reservation not found');

        // Envoi d'un email de modification
        const subject = 'Modification reservation';
        const htmlContent = `
            <p>Bonjour ${reservation.user.username}</p>
            <p>Votre reservation a été changée à: ${reservation.dateDebut}</p>`
        ;
        await sendEmail(reservation.user.email, subject, htmlContent);

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