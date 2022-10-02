const mongoose = require("mongoose")

const OrdersSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
      
       
    },
    products:[
        {
           ProductId :{
               type:String,
           },
           quantity:{
               type: Number,
               default:1,
           }

        }
    ]
    
    
    
    
},{timestamps: true})

module.exports = mongoose.model("Orders",OrdersSchema)