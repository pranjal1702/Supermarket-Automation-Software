const mongoose=require('mongoose');

const transactionSchema=new mongoose.Schema({
    customerName:{
        type:String,
        required:true
    },
    customerPhone:{
        type:Number,
        rqeuired:true
    },
    transactions: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'unitTransaction'
        }
    ],
    payable:{
        type:Number,
        default:0
    },
    dateAdded:{
        type:Date,
        default:Date.now()
    }
    
});

const transacationModel=mongoose.model('transaction',transactionSchema);
module.exports=transacationModel;
