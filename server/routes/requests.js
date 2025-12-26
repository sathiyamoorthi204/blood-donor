const express = require('express');
const Request = require('../models/Request');
const Donor = require('../models/Donor');
const User = require('../models/User');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

const router = express.Router();

// @route   GET api/requests
// @desc    Get all requests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().populate('requester', 'name email');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/requests
// @desc    Create request
// @access  Private
router.post('/', auth, async (req, res) => {
  const { bloodType, location, urgency, donor } = req.body;
  try {
    const request = new Request({
      requester: req.user.id,
      donor,
      bloodType,
      location,
      urgency
    });
    await request.save();

    if (donor) {
      const donorDoc = await Donor.findById(donor).populate('user');
      const user = await User.findById(req.user.id);
      transporter.sendMail({
        from: process.env.EMAIL,
        to: donorDoc.user.email,
        subject: 'Blood Request',
        text: `You have a blood request from ${user.name} (${user.email}) for ${bloodType} at ${location}. Urgency: ${urgency}`
      });
    }

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/requests/:id
// @desc    Update request
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { bloodType, location, urgency, status } = req.body;
  try {
    let request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    if (request.requester.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    request = await Request.findByIdAndUpdate(req.params.id, { bloodType, location, urgency, status }, { new: true });
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/requests/:id
// @desc    Delete request
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    if (request.requester.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    await Request.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Request removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/requests/request-all
// @desc    Request all matching donors
// @access  Private
router.post('/request-all', auth, async (req, res) => {
  const { bloodType, location } = req.body;
  try {
    const donors = await Donor.find({ bloodType, location }).populate('user');
    const user = await User.findById(req.user.id);
    for (const d of donors) {
      const request = new Request({
        requester: req.user.id,
        donor: d._id,
        bloodType,
        location,
        urgency: 'medium'
      });
      await request.save();
      transporter.sendMail({
        from: process.env.EMAIL,
        to: d.user.email,
        subject: 'Blood Request',
        text: `Blood request from ${user.name} (${user.email}) for ${bloodType} at ${location}`
      });
    }
    res.json({ msg: 'Requests sent to all matching donors' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

