const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
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
    expired_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    timestamps: false,
    hooks: {
      beforeCreate: async (user, options) => {
        user.expired_at = sequelize.literal("CURRENT_DATE + INVERVAL 1 YEAR");
      },
    },
  }
);
module.exports = User;
