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
    }

});


module.exports = mongoose.model("Review", foodreviewSchema)