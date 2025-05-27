const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expenseControllers');
const authenticate = require('../middleware/auth');

router.post('/addExpense', authenticate, expenseController.addExpense);
router.get('/showExpense', authenticate, expenseController.showExpense);
router.get('/showMonthlyExpense', authenticate, expenseController.showMonthlyExpense);
router.get('/showYearlyExpense', authenticate, expenseController.showYearlyExpense);
router.get('/get-all-expenses', authenticate, expenseController.getAllExpenseData);

module.exports = router;