const fs = require('fs');
const path = require('path');

const dirs = ['models', 'controllers', 'routes', 'middleware', 'uploads'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const files = {
    'db.js': `const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false
});
module.exports = sequelize;`,
    
    'models/User.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
});
module.exports = User;`,

    'models/Route.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Route = sequelize.define('Route', {
    source: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    distance: { type: DataTypes.FLOAT },
    basePrice: { type: DataTypes.FLOAT, allowNull: false }
});
module.exports = Route;`,

    'models/PassType.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const PassType = sequelize.define('PassType', {
    name: { type: DataTypes.STRING, allowNull: false }, // Monthly, Quarterly, Yearly
    durationDays: { type: DataTypes.INTEGER, allowNull: false },
    multiplier: { type: DataTypes.FLOAT, allowNull: false } // e.g. Monthly = 1, Yearly = 10
});
module.exports = PassType;`,

    'models/Application.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Application = sequelize.define('Application', {
    status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), defaultValue: 'Pending' },
    documentUrl: { type: DataTypes.STRING },
    expiryDate: { type: DataTypes.DATE },
    passId: { type: DataTypes.STRING, unique: true },
    qrCodeData: { type: DataTypes.TEXT }
});
module.exports = Application;`,

    'models/Payment.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Payment = sequelize.define('Payment', {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'Online' },
    status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' }
});
module.exports = Payment;`,

    'models/index.js': `const sequelize = require('../db');
const User = require('./User');
const Route = require('./Route');
const PassType = require('./PassType');
const Application = require('./Application');
const Payment = require('./Payment');

User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

Route.hasMany(Application, { foreignKey: 'routeId' });
Application.belongsTo(Route, { foreignKey: 'routeId' });

PassType.hasMany(Application, { foreignKey: 'passTypeId' });
Application.belongsTo(PassType, { foreignKey: 'passTypeId' });

Application.hasOne(Payment, { foreignKey: 'applicationId' });
Payment.belongsTo(Application, { foreignKey: 'applicationId' });

module.exports = { sequelize, User, Route, PassType, Application, Payment };`,

    'middleware/auth.js': `const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') next();
    else res.status(403).json({ error: 'Access denied. Admin only.' });
};

module.exports = { authenticate, isAdmin };`,

    'controllers/authController.js': `const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, phone, role: 'user' });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email, role: 'admin' } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials or not an admin' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
};`,

    'controllers/applicationController.js': `const { Application, Route, PassType, User, Payment } = require('../models');

exports.applyPass = async (req, res) => {
    try {
        const { routeId, passTypeId } = req.body;
        const documentUrl = req.file ? req.file.path : null;

        const application = await Application.create({
            userId: req.user.id,
            routeId,
            passTypeId,
            documentUrl
        });
        res.status(201).json({ message: 'Application submitted successfully', application });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getUserApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            where: { userId: req.user.id },
            include: [Route, PassType]
        });
        res.json(applications);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            include: [User, Route, PassType]
        });
        res.json(applications);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByPk(req.params.id, { include: [PassType] });
        if (!application) return res.status(404).json({ error: 'Application not found' });

        application.status = status;
        if (status === 'Approved') {
            const passType = await PassType.findByPk(application.passTypeId);
            application.passId = 'BP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
            
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + passType.durationDays);
            application.expiryDate = expiry;

            application.qrCodeData = JSON.stringify({ passId: application.passId, expiryDate: expiry });
        }
        await application.save();
        res.json({ message: 'Application updated', application });
    } catch (err) { res.status(500).json({ error: err.message }); }
};`,

    'controllers/routeController.js': `const { Route, PassType } = require('../models');

exports.getRoutes = async (req, res) => {
    try {
        const routes = await Route.findAll();
        res.json(routes);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createRoute = async (req, res) => {
    try {
        const route = await Route.create(req.body);
        res.status(201).json(route);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getPassTypes = async (req, res) => {
    try {
        const types = await PassType.findAll();
        res.json(types);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createPassType = async (req, res) => {
    try {
        const type = await PassType.create(req.body);
        res.status(201).json(type);
    } catch (err) { res.status(500).json({ error: err.message }); }
};`,

    'routes/authRoutes.js': `const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin/login', authController.adminLogin);

module.exports = router;`,

    'routes/applicationRoutes.js': `const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, isAdmin } = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', authenticate, upload.single('document'), applicationController.applyPass);
router.get('/my', authenticate, applicationController.getUserApplications);
router.get('/', authenticate, isAdmin, applicationController.getAllApplications);
router.put('/:id/status', authenticate, isAdmin, applicationController.updateApplicationStatus);

module.exports = router;`,

    'routes/routeRoutes.js': `const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/routes', routeController.getRoutes);
router.post('/routes', authenticate, isAdmin, routeController.createRoute);

router.get('/passtypes', routeController.getPassTypes);
router.post('/passtypes', authenticate, isAdmin, routeController.createPassType);

module.exports = router;`,

    'index.js': `const express = require('express');
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
    app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
}).catch(err => console.log('Error syncing database', err));`
};

for (const [filepath, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(__dirname, filepath), content);
}

console.log('Backend files generated.');
