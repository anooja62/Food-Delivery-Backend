const mongoose = require("mongoose");

const foodreviewSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,


    },

    description: {
        type: String,
        required: true,
    },

    isApproved:{
        type:Number,
        default:0
    },
    restaurantId: {
        type: String,
        
        required: true,
      },


});


module.exports = mongoose.model("Review", foodreviewSchema)