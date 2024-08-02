const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const Role = require('../models/role');

exports.createSuperAdmin = async () => {
  const superAdminRole = await Role.findOne({ where: { name: 'superadmin' } });
  const superAdmin = await Admin.findOne({ where: { roleId: superAdminRole.id } });
  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash('superadminpassword', 10);
    await Admin.create({
      username: 'superadmin',
      password: hashedPassword,
      roleId: superAdminRole.id
    });
  }
};

exports.registerAdmin = async (req, res) => {
  const { username, password, authorizationCode } = req.body;

  const superAdminRole = await Role.findOne({ where: { name: 'superadmin' } });
  const adminRole = await Role.findOne({ where: { name: 'admin' } });
  const superAdmin = await Admin.findOne({ where: { roleId: superAdminRole.id } });

  if (!superAdmin || superAdmin.authorizationCode !== authorizationCode) {
    return res.status(401).json({ error: 'Invalid authorization code' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({
    username,
    password: hashedPassword,
    roleId: adminRole.id
  });

  res.status(201).json({ message: 'Admin registered successfully' });
};
exports.updateAuthorizationCode = async (req, res) => {
  const { newAuthorizationCode } = req.body;

  const superAdminRole = await Role.findOne({ where: { name: 'superadmin' } });
  const superAdmin = await Admin.findOne({ where: { roleId: superAdminRole.id } });

  if (!superAdmin) {
    return res.status(404).json({ error: 'Super admin not found' });
  }

  superAdmin.authorizationCode = newAuthorizationCode;
  await superAdmin.save();

  res.status(200).json({ message: 'Authorization code updated successfully' });
};