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
    expire_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    timestamps: false,
    hooks: {
      beforeCreate: async (user, options) => {
        user.expire_at = sequelize.literal("CURRENT_DATE + INTERVAL 1 YEAR");
      },
    },
  }
);
const PromotionInfo = sequelize.define(
  "UserPromotionInfo",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: User, key: "id" },
    },
    promotion_count:{
     type: DataTypes.INTEGER,
     allowNull: false,
     unique:false,
    },
    withdrawable_amount:{
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      unique:false,
      defaultValue:0
    },
    withdraw_expiry_date:{
      type: DataTypes.DATE,
      allowNull: false,
      unique:false,
    }
  },
  {
    tableName: "promotions",
    timestamps: false,
  }
);
const PromotionRecord = sequelize.define(
  "PromotionRecord",
  {
    promoter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: User, key: "id" },
    },
    promotee_phone:{
     type: DataTypes.STRING(20),
     allowNull: false,
     unique:false,
    },
    receipt:{
      type: DataTypes.STRING(255),
      allowNull: false,
      unique:true,
    },
    installation_date:{
      type: DataTypes.DATE,
      allowNull: false,
      unique:false,
    },
    promoted_date :{
      type: DataTypes.DATE,
      allowNull: false,
      unique:false,
      defaultValue:DataTypes.NOW
    }
  },
  {
    tableName: "promotion_records",
    timestamps: false,
  }
);

User.hasMany(PromotionInfo, { foreignKey: "user_id" });
User.hasMany(PromotionRecord, { foreignKey: "promoter_id" });
PromotionInfo.belongsTo(User, { foreignKey: "user_id" });
PromotionRecord.belongsTo(User, { foreignKey: "promoter_id" });
module.exports = {
  User,
  PromotionInfo,
  PromotionRecord
};
