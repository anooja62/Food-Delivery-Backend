const mongoose = require("mongoose");

const reviewSchema=mongoose.Schema({
     name:{
          type:String,
          require: true,
          min:3,
          max:20,
         
      },
     
      review:{
        type:String,
        require:true,
      },
     


    
});



module.exports = mongoose.model("Review",reviewSchema)