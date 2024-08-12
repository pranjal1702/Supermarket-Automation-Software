const express=require('express');
const { verifyToken } = require('../middlewares/UserMiddlewares');
const { getNotifications, changeStatusToRead } = require('../Controllers/NotificationController');
const Router=express.Router();

Router.get('/get-all-notifications',verifyToken,getNotifications);
Router.post('/change-notification-status',verifyToken,changeStatusToRead);

module.exports=Router;