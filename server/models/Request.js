const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  bloodType: { type: String, required: true },
  location: { type: String, required: true },
  urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['open', 'fulfilled'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);