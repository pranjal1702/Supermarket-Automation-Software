require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:3*24*24*60,
    });
}

module.exports={generateToken}