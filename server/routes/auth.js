const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    // Send a realtime notification via socket.io to admin users only
    try {
      const io = req.app.get('io');
      const connectedUsers = req.app.get('connectedUsers');
      if (io && connectedUsers) {
        for (const [uid, info] of connectedUsers.entries()) {
          try {
            if (info && info.role === 'admin') {
              io.to(info.socketId).emit('new-registration', { id: user.id, name: user.name, email: user.email, role: user.role });
            }
          } catch (e) {
            console.error('Error emitting to socket', info, e.message);
          }
        }
      }
    } catch (emitErr) {
      console.error('Realtime notify failed:', emitErr.message);
    }

    // Attempt to send a registration email using the shared mailer utility
    (async () => {
      try {
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL || 'no-reply@bloodapp.local',
          to: email,
          subject: 'Welcome to Blood Donor App',
          text: `Hello ${name},\n\nThank you for registering on Blood Donor App.\n\nRegards,\nTeam`,
          html: `<p>Hello ${name},</p><p>Thank you for registering on Blood Donor App.</p><p>Regards,<br/>Team</p>`
        };

        await sendMail(mailOptions);
        console.log(`✅ Registration email sent to ${email}`);
      } catch (mailErr) {
        console.error('❌ Error sending registration email:', mailErr && mailErr.message ? mailErr.message : mailErr);
      }
    })();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;