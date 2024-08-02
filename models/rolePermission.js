const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');
const Permission = require('./permission');

const RolePermission = sequelize.define('RolePermission', {}, {
  tableName: 'role_permissions',
  timestamps: true,
});

Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });

module.exports = RolePermission;
