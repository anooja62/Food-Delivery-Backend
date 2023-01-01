/** @format */

const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
  name: {
    type: String,

    min: 3,
  },
  license: {
    type: String,
  },

  phone: {
    type: String,

    max: 11,
  },

  email: {
    type: String,

    max: 50,
  },

  pincode: {
    type: Number,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },

  country: {
    type: String,
  },

  isRejected: {
    type: Number,
    default: 0,
  },

  isApproved: {
    type: Number,
    default: 0,
  },
  imgUrl: {
    type: String,
  },
  password: {
    type: String,

    min: 5,
  },
  about: {
    type: String,
  },
  ownername: {
    type: String,
  },
  ownerphone: {
    type: String,
  },
  restImg: {
    type: String,
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
