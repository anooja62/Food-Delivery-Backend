const mongoose = require("mongoose");

const deliveryboySchema=mongoose.Schema({
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
      
      email:{
          type:String,
          require:true,
          
          max:50
      },
      
  
    city:{
        type:String
    },
    
    isRejected:{
        type:Number,
        default:0
    }
     


    
});



module.exports = mongoose.model("Delivery",deliveryboySchema)