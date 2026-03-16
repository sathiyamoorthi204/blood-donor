const express = require("express");
const router = express.Router();
const Donor = require("../models/Donor");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { sendMail } = require("../utils/mailer");


// ✅ GET all donors
router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (err) {
    res.status(500).send("Server error");
  }
});


// ✅ CREATE donor
router.post("/", async (req, res) => {
  try {
    const { name, gender, bloodType, phone, location, email } = req.body;

    if (!name || !gender || !bloodType || !phone || !location) {
      return res.status(400).json({ msg: "Name, gender, blood type, phone, and location are required" });
    }

    const donor = new Donor({
      name,
      gender,
      bloodType,
      phone,
      location,
      email: email || "N/A"
    });

    await donor.save();

    // Send confirmation email to donor (if email provided)
    if (email && email !== "N/A") {
      (async () => {
        try {
          await sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL || 'no-reply@bloodapp.local',
            to: email,
            subject: 'Registration Confirmed - Blood Donor App',
            html: `<p>Dear ${name},</p><p>Thank you for registering as a blood donor. Your information has been added to our system:</p><ul><li><strong>Blood Type:</strong> ${bloodType}</li><li><strong>Location:</strong> ${location}</li><li><strong>Phone:</strong> ${phone}</li></ul><p>When a request matching your blood type is received, you will be notified via email.</p><p>Thank you for helping save lives!</p><p>Regards,<br/>Blood Donor Team</p>`
          });
          console.log(`Donor confirmation email sent to ${email}`);
        } catch (mailErr) {
          console.error('Error sending donor confirmation email:', mailErr.message);
        }
      })();
    }

    // Notify admins about new donor
    (async () => {
      try {
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
          if (admin.email && admin.email !== 'N/A') {
            await sendMail({
              from: process.env.EMAIL_FROM || process.env.EMAIL || 'no-reply@bloodapp.local',
              to: admin.email,
              subject: 'New Donor Registered',
              html: `<p>A new donor has been registered:</p><ul><li><strong>Name:</strong> ${name}</li><li><strong>Blood Type:</strong> ${bloodType}</li><li><strong>Location:</strong> ${location}</li><li><strong>Gender:</strong> ${gender}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Email:</strong> ${email}</li></ul><p>Please review and manage this donor in the system.</p><p>Regards,<br/>Blood Donor App</p>`
            });
          }
        }
        console.log(`New donor notification sent to ${admins.length} admin(s)`);
      } catch (adminErr) {
        console.error('Error notifying admins of new donor:', adminErr.message);
      }
    })();

    res.json(donor);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ GET donor count
router.get("/count", async (req, res) => {
  try {
    const count = await Donor.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



// ✅ UPDATE donor by ID
router.put("/:id", async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({ msg: "Donor not found" });
    }

    res.json(donor);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
