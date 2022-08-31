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
    },
    imgUrl:{
        type:String,
        require:true,
    },
    password: {
        type: String,
    
        min: 5,
      },
      profileImg:{
        type:String,
        require:true,
    },


    
});



module.exports = mongoose.model("Delivery",deliveryboySchema)