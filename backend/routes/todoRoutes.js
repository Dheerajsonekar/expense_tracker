const express = require('express');
const router = express.Router();


const todoController = require('../controllers/todoController');


//todo routes
router.post('/addTodo', todoController.addTodo);
router.get('/showTodo', todoController.showTodo);

module.exports = router;