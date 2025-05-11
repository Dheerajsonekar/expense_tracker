const todo = require("../models/Todo");
const { Op, fn, col, where } = require("sequelize");
const sequelize = require('../config/database')

exports.addTodo = async (req, res) => {
   const t = sequelize.transaction();
  try {
    const { todoTask } = req.body;
    const  userId  = req.user.userId;
    console.log("userId", userId);
    const response = await todo.create({ todoTask, userId }, {transaction: t});
    await t.commit();
    res.status(200).json(response);
  } catch (err) {
    await t.rollback();
    res.status(500).json(err);
  }
};

exports.showTodo = async (req, res) => {
  
  try {
    const { date, page=1, limit=10 } = req.query;
    const  userId  = req.user.userId;

    const offset = (page - 1) * limit;

    

    const { count, rows }= await todo.findAndCountAll({
      where: { userId, [Op.and]: [where(fn("DATE", col("createdAt")), date)] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({ todos: rows, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
