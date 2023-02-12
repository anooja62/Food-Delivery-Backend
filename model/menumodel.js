const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    foodname: {
      type: String,
    },
    price: {
      type: Number,
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
    isAvailable: {
      type: Number,
      default: 1,
    },
    restaurantId: {
      type: String,

      require: true,
    },
  },
  { timestamps: true }
);



const menu = new mongoose.model("menu", foodSchema);

module.exports = menu;
