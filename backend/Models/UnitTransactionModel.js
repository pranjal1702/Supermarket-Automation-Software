const mongoose=require('mongoose');

const unitTransactionSchema=new mongoose.Schema({
    code:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        default:0
    },
    totalPrice:{
        type:Number,
        default:0
    },
    dateAdded:{
        type:Date,
        default:Date.now()
    }
    
});

const unitTransacationModel=mongoose.model('unitTransaction',unitTransactionSchema);
module.exports=unitTransacationModel;
