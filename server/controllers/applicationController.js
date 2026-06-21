const { Application, Route, PassType, User, Payment } = require('../models');

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
};