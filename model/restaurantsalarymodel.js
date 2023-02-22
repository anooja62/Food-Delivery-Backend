/** @format */

const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
    },
    salaryamount: {
      type: Number,
    },
  

  },
  { timestamps: true }
);

const salary = new mongoose.model("salary", salarySchema);

module.exports = salary;
