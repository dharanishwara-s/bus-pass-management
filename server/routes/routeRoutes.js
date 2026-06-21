const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/routes', routeController.getRoutes);
router.post('/routes', authenticate, isAdmin, routeController.createRoute);

router.get('/passtypes', routeController.getPassTypes);
router.post('/passtypes', authenticate, isAdmin, routeController.createPassType);

module.exports = router;