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
    timestamps: true,
    hooks: {
      beforeCreate: async (user, options) => {
        if (!user.expired_at) {
          user.expired_at = new Date(user.submitted_at).setFullYear(new Date(user.submitted_at).getFullYear() + 1);
        }
      },
    },
  }
);

const PromotionInfo = sequelize.define(
  "PromotionInfo",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    promotion_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 0,
    },
    withdrawable_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      unique: false,
      defaultValue: 0,
    },
    withdraw_expiry_date:{
      type: DataTypes.DATE,
      allowNull: false,
      unique:false,
    }
  },
  {
    tableName: "promotionInfo",
    timestamps: true,
  }
);

const PromotionRecord = sequelize.define(
  "PromotionRecord",
  {
    promoter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    promotee_phone: {
      type: DataTypes.STRING(20),
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
      unique: false,
    },
    promoted_date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "promotion_records",
    timestamps: true,
  }
);

const Withdrawals = sequelize.define(
  "Withdrawals",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      unique: false,
    },
    request_date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: false,
      defaultValue: DataTypes.NOW,
    },
    review_date: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: false,
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "expired"),
      allowNull: false,
      unique: false,
      defaultValue: "pending",
    },
    reviewer: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: false,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: false,
    },
  },
  {
    tableName: "withdrawals",
    timestamps: true,
  }
);
User.hasMany(Withdrawals, { foreignKey: "user_id" });
Withdrawals.belongsTo(User, { foreignKey: "user_id" });
module.exports = {
  User,
  PromotionInfo,
  PromotionRecord,
  Withdrawals,
};
