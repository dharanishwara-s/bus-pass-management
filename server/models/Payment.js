const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Payment = sequelize.define('Payment', {
    amount: { type: DataTypes.FLOAT, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'Online' },
    status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' }
});
module.exports = Payment;