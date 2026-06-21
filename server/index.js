const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const routeRoutes = require('./routes/routeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', routeRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log('Error syncing database', err));