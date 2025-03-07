require('./src/utils/cronJobs');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwtAuth = require('./src/middleware/jwtAuth');
const bodyParser = require('body-parser');
const usersRouter = require('./src/routes/authRoutes');
const reservationsRouter = require('./src/routes/reservationsRoutes');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const frontUrl = 'http://localhost:5173';



// Middleware
// ========================================================================

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: frontUrl,
    credentials: true
}));



// Database
// ========================================================================

mongoose.connect(process.env.URL_MONGO)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error) => console.log('Connexion à MongoDB échouée !', error));



// Routes
// ========================================================================

app.use('/auth', usersRouter);
app.use('/reservations', jwtAuth, reservationsRouter);



// Server
// ========================================================================

app.listen(port, () => console.log(`Server is running on port: ${port}`));
