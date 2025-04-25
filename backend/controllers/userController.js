const user = require('../models/user');

exports.createUser = async (req, res)=>{
  console.log("incoming data ",req.body)
    try{
      const {name, email, password} = req.body;
     const existingUser = await user.findOne({where: {email}});
     if(existingUser) return res.status(409).json({message: "user already exists"});

      const response = await user.create({name, email, password});
      res.status(200).json(response);
    }catch(err){
      console.error(err)
        res.status(500).json(err);
    }
}

exports.logIn = async (req, res)=>{
  console.log("incoming login data: ", req.body);
  try{
     const {email, password} = req.body;
     const response = await user.findOne({where: {email, password}});
     if(!response) return res.status(404).json({message: "user not found"});
     if(response.password !== password) return res.status(401).json({message: "incorrect password"});

     if(response){
      res.status(200).json({message: "login successful", user: response});
     }
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
}



