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
const NotificationRoutes=require('./Routes/NotificationRoutes');
//
// 
app.use(cors());
app.use(express.json());

app.use('/user',userRoutes);
app.use('/product',productRoutes);
app.use('/notification',NotificationRoutes);
app.get('/',(req,res)=>{
    console.log("abc");
    res.send("Hello");
})

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to the database");
    } catch (err) {
        console.log("Connection to MongoDB failed:", err);
    }
}

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log("Listening on Port "+PORT);
});