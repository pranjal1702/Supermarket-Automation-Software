const express=require("express");
const app=express();
const mongoose=require('mongoose');

const bodyParser = require('body-parser');

// Increase the limit to 50MB (adjust the value as needed)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const cors=require('cors');
const userRoutes=require('./Routes/UserRoutes');
const productRoutes=require('./Routes/ProductRoutes');
//
app.use(cors());
app.use(express.json());

app.use('/user',userRoutes);
app.use('/product',productRoutes);
app.get('/',(req,res)=>{
    console.log("abc");
    res.send("Hello");
})

// connecting to database
try{
    mongoose.connect("mongodb://127.0.0.1:27017/supermarket");
    console.log("Connected to database");
}catch(err){
    console.log("Connection to mongodb failed : "+err);
}

app.listen(8000,()=>{
    console.log("Listening on Port 8000");
});