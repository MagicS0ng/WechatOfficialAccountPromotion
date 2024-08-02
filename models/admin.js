const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id'
    }
  },
  authorizationCode: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'admins',
  timestamps: false
});

Role.hasMany(Admin, { foreignKey: 'roleId' });
Admin.belongsTo(Role, { foreignKey: 'roleId' });

module.exports = Admin;
