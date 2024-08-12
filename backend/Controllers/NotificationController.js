const NotificationModel = require("../Models/NotificationModel")

const addNotification = async (user, message)=>{
    try{
        await NotificationModel.create({username:user,message:message});
    }catch(err){
        console.log("Some error occured"+ err);
    }
}

const getNotifications =async (req,res)=>{
    const username=req.user.username;
    try{
        const allNotifications = await NotificationModel.find({username:username});
        return res.status(200).send(allNotifications);
    }catch(err){
        return res.status(500).send(err);
    }
}

const changeStatusToRead= async (req,res)=>{
    const id=req.body.id;
     try{
         const updateNotification=await NotificationModel.updateOne({_id:id},{
             seen:true
         })
         return res.status(200).send (updateNotification);
     }catch(err){
         return res.status(502).send(err);
     }
    
}


module.exports={addNotification, getNotifications, changeStatusToRead};