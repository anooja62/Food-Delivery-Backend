const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  
  },
  isAdmin: {
    type: Boolean,
  },
  phone: {
    type: String,
  
  },

  email: {
    type: String,
  
    max: 50,
  },

  password: {
    type: String,

    min: 5,
  },

  isBlocked: {
    type: Number,
    default: 0,
  },
  otp:{
    type:Number,
  }
});

module.exports = mongoose.model("Registeration", userSchema);
