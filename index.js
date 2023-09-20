const express=require("express")
const app=express()
const mongoose = require("mongoose")
const helmet =require("helmet")
const morgon = require("morgan")
const dotenv =require("dotenv")
const connectToDatabase = require('./Connection/connection');

const userRouter=require("./Routes/userRoute")

const cors = require('cors')
const cookieParser =require("cookie-parser") 
mongoose.set('strictQuery', true); 
const bodyParser=require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
dotenv.config();
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json()) 
app.use(helmet())
app.use(morgon("common"))

app.use(cors(
    {
    origin: ['https://master.d16tzbrlj12g0j.amplifyapp.com'],
    method: ['GET,PATCH, PUT, POST, DELETE'],
    credentials: true,
  }
  ));


app.use("/api/auth",userRouter)

app.get("/api/user/hai",(req,res)=>{
    console.log("hai");
    res.send("hai")
})

connectToDatabase();

app.listen(8000,()=>{
    console.log("backend server is running");
    }) 
    