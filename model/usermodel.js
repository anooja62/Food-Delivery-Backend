const mongoose = require("mongoose");

const userSchema=mongoose.Schema({
     name:{
          type:String,
          require: true,
          min:3,
          max:20,
         
      },
      phone:{
          type:Number,
          require:true,
       
          

      },
      email:{
          type:String,
          require:true,
          
          max:50
      },
      
      password:{
          type:String,
          require:true,
          min:6
      },
     
     


    
});



module.exports = mongoose.model("Registeration",userSchema)