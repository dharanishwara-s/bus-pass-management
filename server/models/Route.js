const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Route = sequelize.define('Route', {
    source: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    distance: { type: DataTypes.FLOAT },
    basePrice: { type: DataTypes.FLOAT, allowNull: false }
});
module.exports = Route;