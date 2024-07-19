const express=require('express');
const { createUser, loginUser } = require('../Controllers/UserController');
const Router=express.Router();

Router.post('/create-user',createUser);
Router.post('/login-user',loginUser);

module.exports=Router;