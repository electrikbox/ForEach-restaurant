const cron = require('node-cron');
const Reservations = require('../models/Reservations');
const sendEmail = require('./sendEmail');



// Send an email to users 24 hours before their reservations
// ============================================================================

const schedule = "0 0 * * * *"; // every hour

cron.schedule(schedule, async () => {
	const now = new Date();
	const futurDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

	try {
		const reservations = await Reservations.find({
			dateDebut: { $gt: now, $lt: futurDate}
		}).populate('user');

		for (const reservation of reservations) {
			console.log('Reservation:', reservation);

			const subject = 'Rappel de reservation';
			const htmlContent = `
				<p>Bonjour ${reservation.user.username}</p>
				<p>Votre prochaine reservation: ${reservation.dateDebut}: ${reservation.title}</p>`
			;
			await sendEmail(reservation.user.email, subject, htmlContent);
		};
	}
	catch (error) {
		console.log('Error:', error);
	}
});

module.exports = cron;