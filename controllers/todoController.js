const Todo = require("../models/Todo");

exports.addTodo = async (req, res) => {
  try {
    const { todoTask } = req.body;
    const userId = req.user.userId;

    if (!todoTask) return res.status(400).json({ msg: "Task is required" });

    const response = await Todo.create({ todoTask, userId });

    res.status(200).json(response);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.showTodo = async (req, res) => {
  try {
    const { date, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;

    const offset = (page - 1) * parseInt(limit);

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const [todos, count] = await Promise.all([
      Todo.find({
        userId,
        createdAt: { $gte: start, $lt: end }
      })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(parseInt(limit)),
      Todo.countDocuments({
        userId,
        createdAt: { $gte: start, $lt: end }
      }),
    ]);

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({ todos, totalPages });
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
