const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  const { amountType, description, amount, category } = req.body;
  const userId = req.user.userId;

  try {
    if (!amountType || !description || !amount || !category) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const expenseData = await Expense.create({
      amountType,
      description,
      amount,
      category,
      userId,
    });

    res.status(201).json({ message: "Expense added successfully", expenseData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.showExpense = async (req, res) => {
  const { date, page = 1, limit = 5 } = req.query;
  const userId = req.user.userId;

  const offset = (page - 1) * limit;

  try {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const [expenses, count] = await Promise.all([
      Expense.find({ userId, createdAt: { $gte: start, $lt: end } })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(parseInt(limit)),
      Expense.countDocuments({ userId, createdAt: { $gte: start, $lt: end } }),
    ]);

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({ expenses, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.showMonthlyExpense = async (req, res) => {
  const { date, page = 1, limit = 10 } = req.query;
  const userId = req.user.userId;

  const offset = (page - 1) * limit;

  try {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    const [expenses, count] = await Promise.all([
      Expense.find({ userId, createdAt: { $gte: start, $lt: end } })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(parseInt(limit)),
      Expense.countDocuments({ userId, createdAt: { $gte: start, $lt: end } }),
    ]);

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({ expenses, totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

exports.showYearlyExpense = async (req, res) => {
  const { date } = req.query;
  const userId = req.user.userId;

  try {
    const inputDate = new Date(date);
    const year = inputDate.getFullYear();

    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const expenses = await Expense.find({ userId, createdAt: { $gte: start, $lt: end } }).sort({ createdAt: 1 });

    res.status(200).json({ expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllExpenseData = async (req, res) => {
  const userId = req.user.userId;
  const date = new Date();

  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const endOfYear = new Date(date.getFullYear() + 1, 0, 1);

  try {
    const [daily, monthly, yearly] = await Promise.all([
      Expense.find({ userId, createdAt: { $gte: startOfDay, $lt: endOfDay } }).sort({ createdAt: -1 }),
      Expense.find({ userId, createdAt: { $gte: startOfMonth, $lt: endOfMonth } }).sort({ createdAt: -1 }),
      Expense.find({ userId, createdAt: { $gte: startOfYear, $lt: endOfYear } }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({ daily, monthly, yearly });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
