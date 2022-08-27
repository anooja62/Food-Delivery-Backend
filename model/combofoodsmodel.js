const mongoose = require("mongoose");


const combofoodsSchema = new mongoose.Schema({
    Items:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    imgUrl:{
        type:String
    },
  
    isDeleted:{
        type:Number,
        default:0
    },

    
});


// create model

const combo = new mongoose.model("combo",combofoodsSchema);

module.exports = combo;
