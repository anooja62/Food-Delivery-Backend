const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodname: {
    type: String,
    
    
  },
  price: {
    type: String,
   
  },
  category: {
    type: String,
    
  },
  imgUrl: {
    type: String,
   
  },

  isDeleted: {
    type: Number,
    default: 0,
  },
  restaurantId: {
    type: String,

    require: true,
  },
 }, { timestamps: true });

// create model

const menu = new mongoose.model("menu", foodSchema);

module.exports = menu;
