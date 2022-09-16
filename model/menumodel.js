const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodname: {
    type: String,
    required: true,
    unique:true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    unique:true,
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
