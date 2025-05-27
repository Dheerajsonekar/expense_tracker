const Expense = require("../models/Expense");
const User = require("../models/user");
const {Sequelize} = require('sequelize');


exports.showleaderboard = async (req, res) => {

 
  try {
    // MySQL compatible query
    const leaderboard = await User.findAll({
      attributes: [
        'id', 
        'name',
        [Sequelize.fn('COALESCE', 
          Sequelize.fn('SUM', 
            Sequelize.literal('CASE WHEN expenses.amountType = "debit" THEN expenses.amount ELSE 0 END')
          ), 0), 
        'totalExpense']
      ],
      include: [{
        model: Expense,
        attributes: [], // No need to fetch expense details
        required: false // LEFT JOIN to include users with no expenses
      }],
      group: ['user.id', 'user.name'], // Include all non-aggregated columns in GROUP BY
      order: [[Sequelize.literal('totalExpense'), 'DESC']],
      
    });

   

    return res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (err) {

     

    console.error("Error fetching leaderboard data:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard data",
      error: err.message,
    });
  }
};
