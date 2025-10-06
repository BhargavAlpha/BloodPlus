# 🩸 BloodPlus - Setup Guide

## Quick Start Guide for Beginners

### Step 1: Install MongoDB
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service

### Step 2: Setup Backend

1. Open terminal in the BloodPlus folder
2. Install backend dependencies:
```powershell
npm install
```

3. Update the `.env` file with your email credentials (for sending notifications):
   - EMAIL_USER: your Gmail address
   - EMAIL_PASS: your Gmail app password (not regular password)
   
   To get Gmail app password:
   - Go to Google Account settings
   - Security > 2-Step Verification
   - App passwords > Generate new password

4. Start the backend server:
```powershell
npm run dev
```

You should see: "✅ Connected to MongoDB" and "🚀 Server running on port 5000"

### Step 3: Setup Frontend

1. Open a NEW terminal in the BloodPlus folder
2. Navigate to client folder:
```powershell
cd client
```

3. Install frontend dependencies:
```powershell
npm install
```

4. Start React app:
```powershell
npm start
```

The app will open automatically at http://localhost:3000

## Features

✅ **User Registration & Login**
- Simple registration form with all details
- Secure password hashing
- JWT authentication

✅ **Donor Management**
- Profile creation with blood group and location
- Update availability status
- Track last donation date

✅ **Blood Search**
- Search donors by blood group
- Filter by location (city)
- View donor contact details

✅ **Blood Requests**
- Create urgent blood requests
- Set urgency levels (Low, Medium, High, Critical)
- View all active requests
- Filter requests by blood group and location

✅ **Email Notifications**
- Automatic email to nearby donors when blood is needed
- Emails sent to donors matching blood group and location

✅ **Dashboard**
- Quick access to all features
- View your blood requests
- Beautiful blood-themed design

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **nodemailer** - Email sending

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Vanilla CSS** - Styling (no complex CSS frameworks)

## Project Structure

```
BloodPlus/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── SearchDonors.js
│   │   │   ├── CreateRequest.js
│   │   │   ├── ViewRequests.js
│   │   │   └── Profile.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── models/                 # Database models
│   ├── User.js
│   └── Request.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── donors.js
│   └── requests.js
├── middleware/
│   └── auth.js
├── utils/
│   └── emailService.js
├── server.js              # Main backend file
├── .env                   # Environment variables
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Donors
- `GET /api/donors/search?bloodGroup=A+&city=Mumbai` - Search donors
- `GET /api/donors/profile/:id` - Get donor profile
- `PUT /api/donors/profile/:id` - Update donor profile

### Blood Requests
- `POST /api/requests/create` - Create blood request
- `GET /api/requests/active` - Get all active requests
- `GET /api/requests/search?bloodGroup=A+&city=Mumbai` - Search requests
- `PUT /api/requests/:id/status` - Update request status
- `GET /api/requests/my-requests` - Get user's requests

## Testing the App

1. **Register** a new account with your details
2. **Login** with your credentials
3. **Update Profile** to set your availability
4. **Search for Donors** by blood group and city
5. **Create a Blood Request** to notify nearby donors
6. **View All Requests** to see active blood needs

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is installed and running
- Check if MongoDB service is started

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS in .env file
- Use Gmail app password, not regular password
- Enable "Less secure app access" if needed

### Port Already in Use
- Backend uses port 5000
- Frontend uses port 3000
- Close any applications using these ports

## Additional Features Ideas

You can extend this app with:
- SMS notifications
- Blood donation camps management
- Blood bank inventory tracking
- Donation history and statistics
- Rewards system for frequent donors
- Medical reports upload
- Admin panel
- Mobile app

## Support

For any issues, check:
1. MongoDB is running
2. All dependencies are installed
3. .env file is configured correctly
4. Both backend and frontend servers are running

Happy Coding! 🚀
