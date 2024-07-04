const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('smartlock', 'root', 'iqjkhl', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql'
})
module.exports = sequelize;
