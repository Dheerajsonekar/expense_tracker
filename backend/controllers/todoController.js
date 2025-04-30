const todo = require('../models/Todo');

exports.addTodo = async (req, res)=>{
    console.log("incoming data", req.body);
    try{
        const {todoTask} = req.body;
        const {userId} = req.user.userId;
        console.log("userId", userId);
        const response = await todo.create({todoTask, userId});
        
        res.status(200).json(response);
    }catch(err){
        res.status(500).json(err);
    }
}

exports.showTodo = async (req, res)=>{
       console.log("incoming query", req.query);
    try{
        const { date} = req.query;
        const {userId} = req.user.userId;
        console.log("userId", userId);
        const response = await todo.findAll({where: {userId, createdAt:{ [Op.startsWith]: date}}});
        res.status(200).json(response);
    }catch(err){
        res.status(500).json(err);
    }
}