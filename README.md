# BloodPlus - Blood Donation App

A simple MERN stack application for blood donation management.

## Features

- **User Registration & Login**: Users can create accounts and login
- **Donor Profiles**: Store donor information including blood group, location, and contact details
- **Blood Search**: Search for donors by blood group and location
- **Blood Requests**: Create urgent blood requests
- **Email Notifications**: Automatically notify nearby donors when blood is needed
- **Availability Status**: Donors can update their availability
- **Request Tracking**: Track blood request status

## Technologies

- **Frontend**: React.js with vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Email**: Nodemailer

## Setup Instructions

### Backend Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bloodplus
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_here
```

3. Make sure MongoDB is running on your system

4. Start the server:
```
npm run dev
```

### Frontend Setup

1. Navigate to client folder:
```
cd client
```

2. Install dependencies:
```
npm install
```

3. Start React app:
```
npm start
```

The app will run on http://localhost:3000

## Blood Groups Supported

A+, A-, B+, B-, AB+, AB-, O+, O-

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Donors
- GET /api/donors/search?bloodGroup=A+&city=Mumbai - Search donors
- GET /api/donors/profile/:id - Get donor profile
- PUT /api/donors/profile/:id - Update donor profile

### Blood Requests
- POST /api/requests/create - Create blood request
- GET /api/requests/active - Get all active requests
- GET /api/requests/search - Search requests
- PUT /api/requests/:id/status - Update request status
- GET /api/requests/my-requests - Get user's requests

## License

MIT
