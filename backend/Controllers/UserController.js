const { generateToken } = require('../Config/GenerateTokens');
const UserModel=require('../Models/UserModel');
const bcrypt = require("bcryptjs");


const createUser=async (req,res)=>{
    const {username,fullName,password}=req.body;
    if(username==null||username==''||fullName==null||fullName==''||password==''||password==null){
        return res.status(400).send({message:"All required details not provided"})
    }
    try{
        const existingUser=await UserModel.findOne({username:username});
        if(existingUser){
            return res.status(409).send({message:"Username Already exist"});
        }
        const newUser=await UserModel.create({username:username,
        fullName:fullName,password:password});
        const token=generateToken(newUser._id);
       
        res.status(201).send({message:"User Signed up successfully",user:newUser,token:token});
    }catch(err){
        console.log(err.message);
        res.status(500).send({message:"Server error"});
    }
}

const loginUser=async (req,res)=>{
    try{
        const {username,password}=req.body;
        if(!username||!password||username==''||password==''){
            return res.status(400).send({message:"All details not provided"});
        }
        const existingUser=await UserModel.findOne({username:username});
        if(!existingUser){
            return res.status(400).send({message:"Incorrect Username or Password"});
        }
        const auth = await bcrypt.compare(password,existingUser.password);
        if(!auth){
            return res.status(400).send({message:"Incorrect Username or Password"});
        }
        const token=generateToken(existingUser._id);

        res.status(201).json({ message: "User logged In successfully", user:existingUser,token:token });
    }catch(err){
        return res.status(500).send({message:"Internal server error"});
    }
}

module.exports={createUser,loginUser};

