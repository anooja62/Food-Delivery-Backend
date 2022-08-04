const mongoose = require("mongoose");

const userSchema=mongoose.Schema({
     name:{
          type:String,
          require: true,
          min:3,
          max:20,
         
      },
      isAdmin:{
        type:Boolean,
        
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
      
      password:{
          type:String,
          require:true,
          min:5
      },
     role:{
        type:Number,
        
     }
     


    
});



module.exports = mongoose.model("Registeration",userSchema)