const todo = require('../models/Todo');

exports.addTodo = async (req, res)=>{
    console.log("incoming data", req.body);
    try{
        const {todoTask, userId} = req.body;
        const response = await todo.create({todoTask, userId});
        
        res.status(200).json(response);
    }catch(err){
        res.status(500).json(err);
    }
}

exports.showTodo = async (req, res)=>{
       console.log("incoming query", req.query);
    try{
        const {userId, date} = req.query;
        const response = await todo.findAll({where: {userId, createdAt:{ [Op.startsWith]: date}}});
        res.status(200).json(response);
    }catch(err){
        res.status(500).json(err);
    }
}