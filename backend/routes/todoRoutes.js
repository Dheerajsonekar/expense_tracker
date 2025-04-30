const express = require('express');
const router = express.Router();


const todoController = require('../controllers/todoController');
const authenticate = require('../middleware/auth');


//todo routes
router.post('/addTodo', authenticate, todoController.addTodo);
router.get('/showTodo', authenticate, todoController.showTodo);

module.exports = router;