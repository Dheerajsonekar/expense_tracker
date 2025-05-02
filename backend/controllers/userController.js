const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwt_secret = process.env.JWT_SECRET;

exports.createUser = async (req, res)=>{
  // console.log("incoming data ",req.body)
    try{
      const {name, email, password} = req.body;
     const existingUser = await user.findOne({where: {email}});
     if(existingUser) return res.status(409).json({message: "user already exists"});

     //convert password to hash
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await user.create({name, email, password: hashedPassword});

      res.status(200).json(response);
    }catch(err){
      console.error(err)
        res.status(500).json(err);
    }
}

exports.logIn = async (req, res)=>{
  // 
  try{
     const {email, password} = req.body;
     const response = await user.findOne({where: {email}});

     if(!response) return res.status(404).json({message: "user not found"});

     // check if password is correct
     const isPasswordCorrect = await bcrypt.compare(password, response.password);
     if(!isPasswordCorrect) return res.status(401).json({message: "incorrect password"});

     const token = jwt.sign({userId: response.id, name: response.name}, jwt_secret, {expiresIn: '1h'});

     
      res.status(200).json({token, name: response.name});
     
  }catch(err){
    console.error(err);
    res.status(500).json(err);
  }
}



