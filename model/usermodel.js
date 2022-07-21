const mongoose = require("mongoose");

const userSchema=mongoose.Schema({
     name:{
          type:String,
          require: true,
          min:3,
          max:20,
          unique:true
      },
      phone:{
          type:Number,
          require:true,
          max:10,
          unique:true

      },
      email:{
          type:String,
          require:true,
          unique:true,
          max:50
      },
      
      password:{
          type:String,
          require:true,
          min:6
      },
      re_enterpassword:{
        type:String,
        require:true,
        min:6
      }
     


    
});



module.exports = mongoose.model("Registeration",userSchema)