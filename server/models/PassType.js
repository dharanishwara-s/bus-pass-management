const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const PassType = sequelize.define('PassType', {
    name: { type: DataTypes.STRING, allowNull: false }, // Monthly, Quarterly, Yearly
    durationDays: { type: DataTypes.INTEGER, allowNull: false },
    multiplier: { type: DataTypes.FLOAT, allowNull: false } // e.g. Monthly = 1, Yearly = 10
});
module.exports = PassType;