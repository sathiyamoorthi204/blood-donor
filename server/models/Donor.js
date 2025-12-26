const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bloodType: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  availability: { type: Boolean, default: true }
});

module.exports = mongoose.model('Donor', DonorSchema);