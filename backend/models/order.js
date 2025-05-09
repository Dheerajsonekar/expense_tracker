const db = require('../config/database');
const {DataTypes} = require('sequelize');


const Order = db.define("order", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  paymentSessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
    defaultValue: "PENDING",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
        model: 'users',
        key: 'id'
    }
  },
});

module.exports = Order;
