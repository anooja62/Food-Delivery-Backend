const mongoose = require("mongoose");

const shippingSchema=mongoose.Schema({
     name:{
          type:String,
          require: true,
          min:3,
          max:20,
         
      },
    
      phone:{
        type:String,
        require:true,
        max:11,
        
        
    },
      
      pincode:{
          type:String,
          require:true,
          
         
      },
      
      address:{
        type:String,
        require:true,
        min:5
    },
   userId:{
    type:String,
    require:true
   },
   isDeleted:{
    type:Number,
    default:0
}



    
});



module.exports = mongoose.model("Address",shippingSchema)