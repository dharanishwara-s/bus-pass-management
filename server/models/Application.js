const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Application = sequelize.define('Application', {
    status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), defaultValue: 'Pending' },
    documentUrl: { type: DataTypes.STRING },
    expiryDate: { type: DataTypes.DATE },
    passId: { type: DataTypes.STRING, unique: true },
    qrCodeData: { type: DataTypes.TEXT }
});
module.exports = Application;