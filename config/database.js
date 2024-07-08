const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('smartlock', 'root', 'iqjkhl', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    timezone: '+08:00',
    logging: false,
})
module.exports = sequelize;
