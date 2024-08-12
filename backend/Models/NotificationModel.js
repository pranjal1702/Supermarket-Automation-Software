const mongoose= require("mongoose");
const NotificationSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"]
    },
    message:{
        type:String
    },
    seen:{
        type:Boolean,
        default: false
    }
})

const NotificationModel = mongoose.model('notification', NotificationSchema);
module.exports = NotificationModel;