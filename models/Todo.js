const db = require('../config/database');
const {DataTypes} = require('sequelize');

const Todo = db.define('todo', {
    todoTask:{
        type: DataTypes.STRING,
        allowNull: false
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'users',
            key:'id'
        }
    }
    
})


module.exports = Todo;