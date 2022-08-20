const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,

    min: 3,
    max: 20,

  },
  isAdmin: {
    type: Boolean,

  },
  phone: {
    type: String,

    max: 11,


  },

  email: {
    type: String,


    max: 50
  },

  password: {
    type: String,

    min: 5
  },
 

  isBlocked:{
    type:Number,
    default:0
}


});



module.exports = mongoose.model("Registeration", userSchema)