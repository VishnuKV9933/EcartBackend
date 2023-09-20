const mongoose = require("mongoose")

const modeluser = new mongoose.Schema({

    username:{
        type:String, 
        required:[true,"Name is required"],
        minLength:3, 
        maxLength:20,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        minLength:3, 
        maxLength:50,
    },
       password:{
        type:String,
        required:[true,"password is required"],
    },
    
},
{timestamps:true}
)

module.exports=mongoose.model("User",modeluser)