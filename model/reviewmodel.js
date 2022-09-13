const mongoose = require("mongoose");

const foodreviewSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,


    },

    description: {
        type: String,
        require: true,
    },

    isApproved:{
        type:Number,
        default:0
    },
    restaurantId: {
        type: String,
    
        require: true,
      },


});


module.exports = mongoose.model("Review", foodreviewSchema)