# Bus Pass Management System

A full-stack web application for managing bus passes, routes, and applications with user authentication and payment processing.

## Features

✅ **User Management**
- User registration and login with JWT authentication
- Role-based access control (Admin/User)
- Password hashing with bcrypt

✅ **Bus Pass Management**
- Apply for bus passes
- View pass details and status
- Different pass types (Student, Senior, Regular)
- Application tracking

✅ **Route Management**
- Manage bus routes
- View available routes
- Route scheduling

✅ **Payments**
- Payment processing integration
- Transaction history tracking
- Invoice generation

✅ **Admin Dashboard**
- Manage users and applications
- View system statistics
- Upload and manage documents

✅ **User Dashboard**
- View personal applications
- Track pass status
- Download documents

## Tech Stack

**Frontend:**
- React 18+ with Vite
- CSS3 for styling
- Axios for API calls
- React Router for navigation

**Backend:**
- Node.js with Express.js
- Sequelize ORM
- MySQL database
- JWT for authentication
- Multer for file uploads
- CORS for cross-origin requests

**Database:**
- MySQL with 6 core models:
  - User (authentication)
  - PassType (pass categories)
  - Application (pass applications)
  - Payment (payment records)
  - Route (bus routes)
  - Uploaded documents

## Project Structure

```
bus-pass-management/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Helper functions
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js backend
│   ├── controllers/        # Business logic
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   ├── uploads/            # File uploads
│   ├── index.js            # Server entry point
│   ├── db.js               # Database connection
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MySQL database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dharanishwara-s/bus-pass-management.git
cd bus-pass-management
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Setup environment variables**
Create a `.env` file in the server directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bus_pass_db
PORT=5000
JWT_SECRET=your_secret_key
```

5. **Initialize database**
```bash
cd server
npm run setup  # or node createDB.js
npm run seed   # Seed admin and sample data
```

### Running the Application

**Terminal 1 - Start the server:**
```bash
cd server
node index.js
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Start the client:**
```bash
cd client
npm run dev
```
Client runs on: `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create route (admin)
- `PUT /api/routes/:id` - Update route (admin)
- `DELETE /api/routes/:id` - Delete route (admin)

## Database Models

### User
- id, email, password, firstName, lastName, role, createdAt, updatedAt

### PassType
- id, name, description, price, validity, createdAt, updatedAt

### Application
- id, userId, passTypeId, status, documents, createdAt, updatedAt

### Payment
- id, applicationId, amount, transactionId, status, createdAt, updatedAt

### Route
- id, routeNumber, source, destination, fare, createdAt, updatedAt

## Usage

### For Users
1. Register/Login to the application
2. Browse available bus pass types
3. Submit pass application with required documents
4. Make payment
5. View application status on dashboard
6. Download approved pass

### For Admins
1. Login with admin credentials
2. View all users and applications
3. Approve/Reject applications
4. Manage bus routes
5. View payment records
6. Download reports

## File Upload

Files are uploaded to the `server/uploads/` directory using Multer middleware.
Supported formats: PDF, JPG, PNG, DOC, DOCX

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Role-based access control
- ✅ Input validation
- ✅ SQL injection prevention (Sequelize parameterized queries)

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database exists: `node createDB.js`

### Port Already in Use
- Change port in `server/index.js`
- Or kill process using port: `lsof -i :5000`

### Module Not Found
- Reinstall dependencies: `npm install`
- Clear node_modules: `rm -rf node_modules && npm install`

## Development

### Running with auto-reload
```bash
# Server (with nodemon)
cd server
npm run dev  # if configured

# Client (auto-reload with Vite)
cd client
npm run dev
```

## Testing

Run tests (if configured):
```bash
npm test
```

## Deployment

### Frontend (Vite Build)
```bash
cd client
npm run build
# Output in: client/dist/
```

### Backend (Node.js)
```bash
cd server
NODE_ENV=production node index.js
```

Deploy to services like:
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Heroku, Railway, Render
- **Database:** AWS RDS, DigitalOcean

## License

This project is licensed under the ISC License.

## Author

Dharanishwara S

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues or questions, please open an issue on GitHub.

## Roadmap

- [ ] Mobile app development
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced analytics
- [ ] QR code pass verification
- [ ] Real-time bus tracking
- [ ] Payment gateway integration (Stripe/Razorpay)
