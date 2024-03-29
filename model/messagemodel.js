const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  
   
  restaurantId: {
    type: String,

    require: true,
  },
  restaurantname:{
    type: String,

    require: true,
  },
  requestFor:{
    type: String,

    require: true,
  },
  msg:{
    type: String,

    require: true,

  },
  reply:{
    type: String,

    require: true,

  },
  isReplyed:{
    type: Number,

   default:0,

  },

 }, { timestamps: true });

// create model

const message = new mongoose.model("message", messageSchema);

module.exports = message;
