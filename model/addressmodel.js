/** @format */

const mongoose = require("mongoose");

const shippingSchema = mongoose.Schema({
  label: {
    type: String,
  },

  name: {
    type: String,
  },

  phone: {
    type: String,
  },

  pincode: {
    type: String,
  },

  address: {
    type: String,
  },
  userId: {
    type: String,
    require: true,
  },
  isDeleted: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Address", shippingSchema);
