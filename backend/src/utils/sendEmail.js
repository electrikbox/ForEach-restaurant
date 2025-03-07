const  nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();



const host = process.env.EMAIL_HOST;
const emailUser = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;



// Create a transporter object
// ============================================================================

const transporter = nodemailer.createTransport({
	host: host,
	port: 587,
	secure: false,
	auth: { user: emailUser, pass: password },
});



// Send an email
// ============================================================================

const sendEmail = async (to, subject, html) => {

	const from = `"Le Gourmet Moderne" <${emailUser}>`;
	await transporter.sendMail({ from, to, subject, html });

	console.debug(`email sent to ${to}`);
};

module.exports = sendEmail;