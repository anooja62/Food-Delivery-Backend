const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  userId: {
    type: String,

   
   unique:true,
  },
  
  amount: {
    type: String,
    require:true,
  },

  receipt:{
    type:String,
  }
  
});

module.exports = mongoose.model("Payment", paymentSchema);
