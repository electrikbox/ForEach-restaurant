const cron = require('node-cron');
const Appointments = require('../models/Reservations');
const sendEmail = require('./sendEmail');



// Send an email to users  24 hours before their appointment
// ============================================================================

const schedule = "0 0 * * * *";

cron.schedule(schedule, async () => {
    const now = new Date();
    const futurDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
        const appointments = await Appointments.find({
            dateDebut: { $gt: now, $lt: futurDate}
        }).populate('user');

        for (const appointment of appointments) {
            console.log('Appointment:', appointment);

            const subject = 'Rappel de rendez-vous';
            const htmlContent = `
                <p>Bonjour ${appointment.user.firstName}</p>
                <p>Votre prochain rendez-vous: ${appointment.dateDebut}: ${appointment.title}</p>`
            ;
            await sendEmail(appointment.user.email, subject, htmlContent);
        };
    }
    catch (error) {
        console.log('Error:', error);
    }
});
