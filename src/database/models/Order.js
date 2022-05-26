const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "done", "cancelled"],
    default: "pending",
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
  },
  price: String,
});

const Order = mongoose.model("Order", schema);

module.exports = Order;
