const express=require('express');
const { createUser, loginUser, getAllUsers, deleteUser } = require('../Controllers/UserController');
const { manager,verifyToken } = require('../middlewares/UserMiddlewares');

const Router=express.Router();

Router.post('/create-user',verifyToken,manager,createUser);
Router.post('/login-user',loginUser);
Router.get('/get-all-users',verifyToken,manager,getAllUsers)
Router.delete('/delete-user/:id',verifyToken,manager,deleteUser)

module.exports=Router;