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

const sendEmail = async (to, subject, htmlContent) => {
	await transporter.sendMail({
		from: `"App RDV" <${emailUser}>`,
		to,
		subject,
		html: htmlContent,
	});

	console.debug(`email sent to ${to}`);
};

module.exports = sendEmail;