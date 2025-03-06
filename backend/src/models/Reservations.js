const mongoose = require('mongoose');

const Reservations = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },
    validated: {
        type: Boolean,
        default: false
    },
    sentEmail: {
        type: Boolean,
        default: false
    },
    nbPersonnes: {
        type: Number,
        required: true
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('Reservations', Reservations);
