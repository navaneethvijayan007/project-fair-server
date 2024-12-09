const users = require('../models/userModel')
const jwt = require('jsonwebtoken')



// register
exports.registerController = async (req,res)=>{
    console.log("Inside registerController ");
    const {username,email,password} = req.body
    console.log(username,email,password);

    try{
        const existingUser = await users.findOne({email})
        if(existingUser){
            res.status(406).json("User already exists ....please login!!!")
        }else{
            const newUser = new users({
                username,email,password,github:"",linkedin:"",profilepic:""
            })
            await newUser.save()
            res.status(200).json(newUser)
        }

    }catch(err){
        res.status(401).json(err)
    }
    
    
}

//login

// login
exports.loginController = async (req,res)=>{
    console.log("Inside loginController");
    const {email,password} = req.body
    console.log(email,password);
    try{
        const existingUser = await users.findOne({email,password})
        if(existingUser){
            //token generation
            const token = jwt.sign({userId:existingUser._id},process.env.JWTPASSWORD)
            res.status(200).json({
                user:existingUser,
                token
            })
        }else{
          res.status(404).json("Invalid e-mail / password!")
        }
    }catch(err){
        res.status(401).json(err)
    }
}

// profile updation