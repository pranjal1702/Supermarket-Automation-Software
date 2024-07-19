const jwt=require('jsonwebtoken');
const userModel = require('../Models/UserModel');

const verifyToken = async (req,res,next) => {
    console.log(req.header("Authorization"));
   const authHeader=req.header("Authorization");

    if(!authHeader||authHeader.split(" ")[0]!="Bearer") return res.status(401).json({ message: 'Access denied' });
    const token=authHeader.split(" ")[1];
    
    console.log(token);
    try{
        const { id } = jwt.verify(token,process.env.JWT_SECRET);
        const user  = await userModel.findById(id); 
        
        req.user = user; 
       
        next();
    }catch(err){
        return res.status(403).json({message:'Token Failed'});
    }
}

const clerk = async (req, res, next) => {
    console.log(req.user);
    if (req.user.isManager) {
        return res.status(401).json({
            message:"Access Denied"
        })
    }
    next()
}

const manager=async(req,res,next)=>{
    console.log(req.user.username);
    if(!req.user.isManager){
        return res.status(401).json({
            message:"Access Denied"
        });
    }
    next();
}

module.exports={verifyToken,clerk,manager}