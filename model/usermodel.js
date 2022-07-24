const mongoose = require("mongoose");

const userSchema=mongoose.Schema({
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
      
      password:{
          type:String,
          require:true,
          min:5
      },
     
     


    
});



module.exports = mongoose.model("Registeration",userSchema)