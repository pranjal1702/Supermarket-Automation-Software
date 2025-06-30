const { generateToken } = require('../Config/GenerateTokens');
const UserModel=require('../Models/UserModel');
const bcrypt = require("bcryptjs");


const createUser=async (req,res)=>{
    const {username,fullName,password,email,isManager}=req.body;
    if(username==null||username==''||fullName==null||fullName==''||password==''||password==null||isManager==null){
        return res.status(400).send({message:"All required details not provided"})
    }
    try{
        const existingUser=await UserModel.findOne({username:username});
        if(existingUser){
            return res.status(409).send({message:"Username Already exist"});
        }
        const newUser=await UserModel.create({username:username,
        fullName:fullName,password:password,email:email,isManager:isManager});
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

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}); // Fetch all users from the database
    if (!users || users.length === 0) {
      return res.status(404).send({ message: "No users found." });
    }
    return res.status(200).send({ users });
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "User ID is required to delete a user." });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send({ message: "User not found." });
    }

    return res.status(200).send({ message: "User deleted successfully.", user: deletedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  const userId = req.user.id; // assuming middleware added req.user
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Old password is incorrect' });

    user.password = newPassword;  // hashing done by mongoose
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports={createUser,loginUser,getAllUsers,deleteUser,updatePassword};

