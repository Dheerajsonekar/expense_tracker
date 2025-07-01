const Expense = require("../models/Expense");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.showleaderboard = async (req, res) => {
  try {
    const leaderboard = await Expense.aggregate([
      {
        $match: { amountType: "debit" } 
      },
      {
        $group: {
          _id: "$userId",
          totalExpense: { $sum: "$amount" }
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          totalExpense: 1
        }
      },
      {
        $sort: { totalExpense: -1 }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (err) {
    console.error("Error fetching leaderboard data:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard data",
      error: err.message
    });
  }
};
