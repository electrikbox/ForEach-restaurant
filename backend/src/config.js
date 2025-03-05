const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DB = mongoose.connect(process.env.URL_MONGO)

module.exports = DB;