const { Route, PassType } = require('../models');

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
};