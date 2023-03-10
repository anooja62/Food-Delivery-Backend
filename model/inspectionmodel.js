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
    isReportDone:{
      type: Boolean,
      default: 0,
    },
    inspectorName:{
      type: String,
    },
    inspectionResults:{
      type: String,
    },
    inspectionRating:{
      type:Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("inspection", inspectionSchema);
