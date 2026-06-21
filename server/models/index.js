const sequelize = require('../db');
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

module.exports = { sequelize, User, Route, PassType, Application, Payment };