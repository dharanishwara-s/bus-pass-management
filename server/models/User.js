const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
});
module.exports = User;