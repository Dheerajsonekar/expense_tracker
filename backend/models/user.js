const db = require('../config/database');
const {DataTypes} = require('sequelize');

const user = db.define('user', {
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = user;