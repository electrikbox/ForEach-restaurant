const cron = require('node-cron');
const Reservations = require('../models/Reservations');
const sendEmail = require('./sendEmail');



// Send an email to users 24 hours before their reservations
// ============================================================================

const schedule = "0 0 * * * *"; // every hour

cron.schedule(schedule, async () => {

	// Get current date and date in 24 hours
	const now = new Date();
	const futurDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

	try {
		const reservations = await Reservations.find({
			dateDebut: { $gt: now, $lt: futurDate}
		}).populate('user');

		// Send email to each user
		for (const reservation of reservations) {
			console.log('Reservation:', reservation);

			const subject = 'Rappel de reservation';
			const htmlContent = `
				<p>Bonjour ${reservation.user.username}</p>
				<p>Votre prochaine reservation: ${reservation.dateDebut}</p>`
			;
			await sendEmail(reservation.user.email, subject, htmlContent);
		};

		await Reservations.updateMany(
			{ _id: { $in: reservations.map(reservation => reservation._id) } },
			{ sentEmail: true }
		);
	}
	catch (error) {
		console.log('Error:', error);
	}
});

module.exports = cron;