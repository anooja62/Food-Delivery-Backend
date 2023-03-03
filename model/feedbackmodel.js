/** @format */

const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    restaurantId: {
      type: String,
    },
  
    foodPackaging: {
      type: String,
    },

    foodHandling: {
      type: String,
    },

    foodQuality: {
      type: String,
    },

    foodTaste: {
      type: String,
    },
    overallExperience: {
      type: String,
    },
    currentDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedback", feedbackSchema);
