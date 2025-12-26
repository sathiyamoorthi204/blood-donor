const express = require('express');
const Donor = require('../models/Donor');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET api/donors
// @desc    Get all donors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find().populate('user', 'name email');
    res.json(donors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/donors
// @desc    Add donor
// @access  Private
router.post('/', auth, async (req, res) => {
  const { bloodType, location, phone } = req.body;
  try {
    const donor = new Donor({
      user: req.user.id,
      bloodType,
      location,
      phone
    });
    await donor.save();
    res.json(donor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/donors/:id
// @desc    Update donor
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { bloodType, location, phone, availability } = req.body;
  try {
    let donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ msg: 'Donor not found' });
    if (donor.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    donor = await Donor.findByIdAndUpdate(req.params.id, { bloodType, location, phone, availability }, { new: true });
    res.json(donor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/donors/:id
// @desc    Delete donor
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ msg: 'Donor not found' });
    if (donor.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    await Donor.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Donor removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;