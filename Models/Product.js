const mongoose = require("mongoose")

const productModel = new mongoose.Schema({

    name:{
        type:String, 
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
    },
    
},
{timestamps:true}
)

module.exports=mongoose.model("Product",productModel)