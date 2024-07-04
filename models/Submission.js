const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Submission = sequelize.define(
  "users",
  {
    openid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nickname: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: false,
    },
    receipt: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    installation_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = Submission;
