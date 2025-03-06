
# ForEach Restaurant

## Project Setup

### Backend
```sh
cd backend
npm install
npm run dev
```

### Frontend
```sh
cd frontend/restaurant
npm install
npm run dev
```

## .env
```
URL_MONGO=mongodb://localhost:27017/<database>
PORT=8000
JWT_SECRET=<jwt secret key>

EMAIL_HOST=<email smtp server>
EMAIL_USER=<email user login>
EMAIL_PASSWORD=<email user password>

MAX_RESERVATIONS=10
```

## admin register
Register un utilisateur normal puis changer son role en "admin" dans la base de donnée directement (en attendant de le créer autrement)