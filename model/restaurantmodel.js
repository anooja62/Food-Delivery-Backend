const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
  name: {
    type: String,

    min: 3,
  },
  license: {
    type: String,
  },
  issuedate:{
    type:String,
  },
  expiredate:{
    type:String,
  },
  licensetype:{
    type:String,
  },

  phone: {
    type: String,

    max: 11,
  },

  email: {
    type: String,

    max: 50,
  },

  address: {
    type: String,

    min: 5,
  },

  isRejected: {
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
  ownername:{
    type:String,
  },
  ownerphone:{
    type:String,
  }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
