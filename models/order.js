const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: {
    type: String, 
    required: true
  },
  paymentSessionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESSFUL", "FAILED"],
    default: "PENDING"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
