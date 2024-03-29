const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    orderReady: {
      type: Number,
    },
    outForDelivery: {
      type: Number,
    },
    isDelivered: {
      type: Number,
    },
    address_id: {
      type: String,
    },
    status: {
      type: String,
    },
    deliveryBoyId: {
      type: String,
    },
    products: [
      {
        ProductId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    orderDate:{
      type:Date,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrdersSchema);
