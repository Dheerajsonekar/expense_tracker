const expense = require("../models/Expense");
const { Op, fn, col, where } = require("sequelize");
const sequelize = require("../config/database");

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  const { amountType, description, amount, category } = req.body;
  const userId = req.user.userId;
  try {
    if (!amountType || !description || !amount || !category) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const expenseData = await expense.create(
      {
        amountType,
        description,
        amount,
        category,
        userId,
      },
      { transaction: t }
    );

    await t.commit();
    res
      .status(201)
      .json({ message: "Expense added successfully", expenseData });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.showExpense = async (req, res) => {
  
  const { date, page = 1, limit = 5 } = req.query;
  const userId = req.user.userId;

  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await expense.findAndCountAll({
      where: { userId, [Op.and]: [where(fn("DATE", col("createdAt")), date)] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    }
   );
    
   

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({ expenses: rows, totalPages });
  } catch (err) {

    
    console.error(err);
    res.status(500).json(err);
  }
};

exports.showMonthlyExpense = async (req, res) => {

  

  const { date, page = 1, limit = 10 } = req.query;
  const userId = req.user.userId;

  const offset = (page - 1) * limit;

  try {
    const inputDate = new Date(date);
    const month = inputDate.getMonth() + 1;
    const year = inputDate.getFullYear();

    const { count, rows } = await expense.findAndCountAll({
      where: {
        userId,
        [Op.and]: [
          where(fn("MONTH", col("createdAt")), month),
          where(fn("YEAR", col("createdAt")), year),
        ],
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({ expenses: rows, totalPages });
  } catch (err) {

    

    console.error(err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

exports.showYearlyExpense = async (req, res) => {
  
  const { date } = req.query;
  const userId = req.user.userId;

  try {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();

    const expenses = await expense.findAll({
      where: {
        userId,
        [Op.and]: [where(fn("YEAR", col("createdAt")), year)],
      },
      order: [["createdAt", "ASC"]],
    });

    

    res.status(200).json({ expenses });
  } catch (err) {
    
    console.error(err);
    res.status(500).json(err);
  }
};
