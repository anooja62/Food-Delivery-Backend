/** @format */

const mongoose = require("mongoose");

const inspectionSchema = mongoose.Schema(
  {
    restaurantId: {
      type: String,
    },

    restaurantName: {
      type: String,
    },
    scheduledDate: {
      type: Date,
    },
    isDone: {
      type: Boolean,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("inspection", inspectionSchema);
