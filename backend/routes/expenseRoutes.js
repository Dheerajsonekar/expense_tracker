const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expenseControllers');
const authenticate = require('../middleware/auth');

router.post('/addExpense', authenticate, expenseController.addExpense);
router.get('/showExpense', authenticate, expenseController.showExpense);
router.get('/showMonthlyExpense', authenticate, expenseController.showMonthlyExpense);

module.exports = router;