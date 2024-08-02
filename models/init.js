const sequelize = require('../config/database');
const Role = require('./role');
const Permission = require('./permission');
const RolePermission = require('./rolePermission');
const Admin = require('./admin');

async function initialize() {
  await sequelize.sync({ force: false, alter:true });

  const [superRole, normalRole] = await Promise.all([
    Role.findOrCreate({ where: { name: 'super' } }),
    Role.findOrCreate({ where: { name: 'normal' } }),
  ]);

  const [registerAdmin, reviewWithdraw] = await Promise.all([
    Permission.findOrCreate({ where: { name: 'register_admin' } }),
    Permission.findOrCreate({ where: { name: 'review_withdraw' } }),
  ]);

  await Promise.all([
    superRole[0].addPermissions([registerAdmin[0], reviewWithdraw[0]]),
    normalRole[0].addPermission(reviewWithdraw[0]),
  ]);

  console.log('Database initialized');
}

module.exports = { initialize };