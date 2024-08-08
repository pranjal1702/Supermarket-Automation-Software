const mongoose=require('mongoose');
const bcrypt = require("bcryptjs");


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"]
    },
    fullName:{
        type:String,
        required:[true,"FullName is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    isManager:{
        type:Boolean,
        default:false
    },email:{
        type: String,
        default: ''
    }
});

// to generate hash using bcrypt
userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});
  

const userModel=mongoose.model('user',userSchema);
module.exports=userModel;
