const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    receipt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    installation_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    submitted_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'submissions',
    timestamps: false
});

module.exports = Submission;
