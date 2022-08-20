const mongoose = require("mongoose");

const restaurantSchema=mongoose.Schema({
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
      
      address:{
          type:String,
          require:true,
          min:5
      },
    isRejected:{
        type:Number,
        default:0
    },
  
     


    
});



module.exports = mongoose.model("Restaurant",restaurantSchema)