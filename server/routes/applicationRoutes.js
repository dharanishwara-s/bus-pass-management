const express = require('express');
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

module.exports = router;