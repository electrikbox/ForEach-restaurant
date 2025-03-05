require('./src/utils/cronJobs');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwtAuth = require('./src/middleware/jwtAuth');
const DB = require('./src/config');
const bodyParser = require('body-parser');
const usersRouter = require('./src/routes/authRoutes');
const reservationsRouter = require('./src/routes/reservationsRoutes');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;



// Middleware
// ========================================================================

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


// Database
// ========================================================================

DB.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((error => console.log('Connexion à MongoDB échouée !', error)));



// Routes
// ========================================================================

app.use('/auth', usersRouter);
app.use('/reservations', jwtAuth, reservationsRouter);



// Server
// ========================================================================

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
