const express=require('express');
const { addItemController, getAllItem, getItemByCode, decreaseQuantity, transactionHandler, increaseQuantity, updatePrice } = require('../Controllers/ProductControllers');
const { getStatsForOneObject, getTotalStats } = require('../Controllers/StatsControllers');

const { manager, clerk,verifyToken } = require('../middlewares/UserMiddlewares');
const Router=express.Router();

// for normal user
Router.post('/decrease-quantity',verifyToken,clerk,decreaseQuantity);
Router.post('/create-transaction',verifyToken,clerk,transactionHandler);

 
// for manager
Router.post('/update-stock', verifyToken,manager,increaseQuantity);
Router.post('/update-price',verifyToken,manager,updatePrice);
Router.post('/add-item',verifyToken,manager,addItemController);
Router.get('/get-items',verifyToken,manager,getAllItem);
Router.get('/get-stats-code',verifyToken,manager,getStatsForOneObject);
Router.get('/get-total-stats',verifyToken,manager,getTotalStats);

// for both
Router.get('/get-itemByCode',verifyToken,getItemByCode);


module.exports=Router;