const { DataTypes } = require('sequelize');
const db = require('../config/database'); 
const { v4: uuidv4 } = require('uuid');
const User = require('./user'); 

const ForgotPasswordRequest = db.define('ForgotPasswordRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

module.exports = ForgotPasswordRequest;
