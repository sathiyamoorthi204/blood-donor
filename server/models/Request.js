const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  requesterName: {
    type: String,
    required: true
  },
  requesterEmail: {
    type: String,
    required: false
  },
  bloodType: {
    type: String,
    required: true
  },
  hospitalName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Request", requestSchema);
