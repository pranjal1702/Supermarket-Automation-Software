const itemModel = require('../Models/ItemModel');
const transacationModel = require('../Models/TransactionModel');
const unitTransacationModel = require('../Models/UnitTransactionModel');
const userModel = require('../Models/UserModel');
const { sendEmail } = require('./EmailController');


const addItemController=async (req,res)=>{
    try{
        const item=await itemModel.findOne({name:req.body.name});
        // console.log(item);
        if(item){
           return res.status(409).send({msg:"Name already exist"});
        }

        const idItem=await itemModel.findOne({code:req.body.code});
        if(idItem){
           return res.status(409).send({msg:"Code already assigned"});
        }

    }catch(err){
        console.log(err);
        return res.status(500).send({msg:err.message}); 
    }


    try{
        const item=await itemModel.create(req.body);
       return res.status(200).send(item);
    }
    catch(err){
        console.log(err);
        return res.status(500).send({msg:err.message});
    }

}

// for updating database when new stock added
const increaseQuantity=async (req,res)=>{
    // check whether name and code are right or not
    const reqItem=req.body;
    let item;
    try{
        item=await itemModel.findOne({name:reqItem.name,code:reqItem.code});
        if(!item){
            return res.status(400).send({msg:"Such item do not exist"});
        }
    }catch(err){
        return res.status(502).send(err);
    }
    console.log(req.body.quantity);
    const newQuantity=parseInt(req.body.quantity)+item.quantity;

    try{
        const newItem=await itemModel.updateOne({_id:item._id},{
            quantity:newQuantity
        })
        return res.status(200).send(newItem);
    }catch(err){
        return res.status(502).send(err);
    }


}

const getManagerEmails = async()=>{
    const managers = await userModel.find({isManager: true});
    const emailList= managers.map((manager)=> manager.email);
    const emailListString = emailList.join(', ');
    return emailListString;
}

// for updating database when item purchased
const decreaseQuantity=async (req,res)=>{
    // check whether name and code are right or not
    const reqItem=req.body;
    let item;
    try{
        item=await itemModel.findOne({code:reqItem.code});
        if(!item){
            return res.status(400).send({msg:"Such item do not exist"});
        }
    }catch(err){
        return res.status(502).send(err);
    }
    if(item.quantity<reqItem.quantity){
        return res.status(200).send({msg:"That quantity is not availbale"});
    }

    const newQuantity=item.quantity-req.body.quantity;

    try{
        const newItem=await itemModel.updateOne({_id:item._id},{
            quantity:newQuantity
        })

        // we have to find the list of  email of employees who are manager
        if(item.quantity>10&&newQuantity<=10){
            try{
                const emailListString= await getManagerEmails();
                sendEmail("Low stock alert for "+ item.name ,"Only "+newQuantity+" item remaining!!",emailListString);
            }catch{
                console.log("Some error occured\n");
            }
        }
        

        return res.status(200).send(newItem);
    }catch(err){
        return res.status(502).send(err);
    }


}

const getAllItem=async (req,res)=>{
    try{
        const searchText=req.query.txt;
        
        const allItem=await itemModel.find({ name : { $regex : new RegExp('^'+searchText, "i") } });
        return res.status(200).send(allItem);
    }catch(err){
            return res.status(500).send(err);
    }
}


const getItemByCode=async (req,res)=>{
    
    try{

        const ourItem=await itemModel.findOne({code:req.query.code});
        // console.log(ourItem);
        // console.log(req);
        if(ourItem){
            return res.status(200).send(ourItem);
        }else{
            return res.status(204).send({msg:"Item Not Found"});
        }
    }catch(err){
        return res.status(500).send(err);
    }
}


//
const transactionHandler=async (req,res)=>{
    // loop over transaction array and create all unit transactions
    const billItems=req.body.billItems;
    // console.log(billItems);
    let transactionIds=[];
    let payable=0;
    try{
        for(const item of billItems){
            payable+=item.totalPrice;
            const addedTransaction=await 
            unitTransacationModel.create({
                code:item.code,
                quantity:item.qty,
                totalPrice:item.totalPrice,
            });
            transactionIds.push(addedTransaction._id);
        }
        const newTransaction=await transacationModel.create({
            customerName:req.body.customerName,
            customerPhone:req.body.customerPhone,
            payable:payable,
            transactions:transactionIds
        })
        return res.status(200).send(newTransaction);
    }catch(err){
        return res.status(500).send(err);
    }
    
}

const updatePrice=async (req,res)=>{
    try{
        const updatedItem=await itemModel.updateOne({code:req.body.code},{
            unitPrice:parseFloat(req.body.newPrice)
        })
        return res.status(200).send(updatedItem);
    }catch(err){
        return res.status(500).send(err);
    }
}

module.exports={addItemController,increaseQuantity,decreaseQuantity,getAllItem,getItemByCode,transactionHandler,updatePrice};