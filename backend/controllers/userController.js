const user = require('../models/user');

exports.createUser = async (req, res)=>{
  console.log("incoming data ",req.body)
    try{
      const {name, email, password} = req.body;
      const response = await user.create({name, email, password});
      res.status(200).json(response);
    }catch(err){
      console.error(err)
        res.status(500).json(err);
    }
}

exports.logIn = async (req, res)=>{

}

