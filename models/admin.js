const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');

const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'admins',
  timestamps: true,
});

Admin.belongsTo(Role);

module.exports = Admin;
