const mongoose=require('mongoose');

const itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:Number,
        required:true
    },
    unitPrice:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        default:0
    },
    dateAdded:{
        type:Date,
        default:Date.now()
    },
    imageSrc:{
        type:String,
        required:true
    }

});

const itemModel=mongoose.model('item',itemSchema);
module.exports=itemModel;
