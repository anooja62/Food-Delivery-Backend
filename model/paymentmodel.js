const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  userId: {
    type: String,
  
    
  },
  amount: {
    type: String,
    required: true,
  },

  order_id: {
    type: String,
  },
  payment_id:{
    type:String,
  },
  cart_id:{
   type:String,
  },
  address_id:{
    type:String
  },
  status:{
    type:String
  },
  method:{
    type:String
  },
  isPaymentDone:{
    type:Number
  }

},{timestamps: true});

module.exports = mongoose.model("Payment", paymentSchema);
