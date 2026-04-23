const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Donor = require('../models/Donor');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

// GET all requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// POST new request
router.post("/", async (req, res) => {
  try {
    const { requesterName, requesterEmail, bloodType, hospitalName, location } = req.body;

    const missing = [];
    if (!requesterName) missing.push('requesterName');
    if (!bloodType) missing.push('bloodType');
    if (!hospitalName) missing.push('hospitalName');
    if (!location) missing.push('location');

    if (missing.length > 0) {
      return res.status(400).json({ message: 'Missing required fields', missing });
    }

    const newRequest = new Request({ requesterName, requesterEmail, bloodType, hospitalName, location });
    await newRequest.save();

    // Send request confirmation to requester (if email provided)
    if (requesterEmail) {
      (async () => {
        try {
          await sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL || 'no-reply@bloodapp.local',
            to: requesterEmail,
            subject: 'Blood Request Submitted',
            html: `<p>Dear ${requesterName},</p><p>Thank you for submitting a blood request. Here are the details:</p><ul><li><strong>Blood Type Needed:</strong> ${bloodType}</li><li><strong>Hospital:</strong> ${hospitalName}</li><li><strong>Location:</strong> ${location}</li><li><strong>Request ID:</strong> ${newRequest._id}</li></ul><p>We are sending notifications to available donors matching your blood type. You will be updated as soon as a donor is found.</p><p>Regards,<br/>Blood Donor Team</p>`
          });
          console.log(`Request confirmation email sent to ${requesterEmail}`);
        } catch (mailErr) {
          console.error('Error sending request confirmation email:', mailErr.message);
        }
      })();
    }

    // Find matching donors and send them notification emails
    (async () => {
      try {
        const { donor: specificDonorId } = req.body;
        let donorsToNotify = [];

        if (specificDonorId) {
          // Notify only the specific donor
          const donor = await Donor.findById(specificDonorId);
          if (donor) {
            donorsToNotify = [donor];
            console.log(`Targeting specific donor: ${donor.email}`);
          } else {
            console.error(`Specific donor not found: ${specificDonorId}`);
          }
        } else {
          // Find all matching donors (blood type and location)
          donorsToNotify = await Donor.find({ 
            bloodType: bloodType,
            location: { $regex: new RegExp(location, "i") } // Case-insensitive location match
          });
          console.log(`Found ${donorsToNotify.length} donor(s) matching blood type ${bloodType} and location ${location}`);
        }
        
        for (const donor of donorsToNotify) {
          if (donor.email && donor.email !== 'N/A') {
            try {
              await sendMail({
                from: process.env.EMAIL_FROM || process.env.EMAIL || 'no-reply@bloodapp.local',
                to: donor.email,
                subject: 'Urgent: Blood Donation Needed - Your Blood Type Match',
                html: `<p>Dear ${donor.name},</p><p>An urgent blood donation request has been received matching your blood type (${bloodType}).</p><ul><li><strong>Requester:</strong> ${requesterName}</li><li><strong>Hospital:</strong> ${hospitalName}</li><li><strong>Location:</strong> ${location}</li><li><strong>Blood Type:</strong> ${bloodType}</li></ul><p>If you are available to donate, please contact this hospital or reply to this email.</p><p>Your donation could save a life!</p><p>Regards,<br/>Blood Donor Team</p>`
              });
              console.log(`Request notification sent to donor ${donor.email}`);
            } catch (donorMailErr) {
              console.error(`Error sending notification to donor ${donor.email}:`, donorMailErr.message);
            }
          }
        }
      } catch (err) {
        console.error('Error finding and notifying donors:', err.message);
      }
    })();

    // Notify admins about new blood request
    (async () => {
      try {
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
          if (admin.email && admin.email !== 'N/A') {
            await sendMail({
              from: process.env.EMAIL_FROM || process.env.EMAIL || 'no-reply@bloodapp.local',
              to: admin.email,
              subject: 'New Blood Donation Request',
              html: `<p>A new blood donation request has been submitted:</p><ul><li><strong>Requester:</strong> ${requesterName}</li><li><strong>Requester Email:</strong> ${requesterEmail || 'Not provided'}</li><li><strong>Blood Type:</strong> ${bloodType}</li><li><strong>Hospital:</strong> ${hospitalName}</li><li><strong>Location:</strong> ${location}</li><li><strong>Request ID:</strong> ${newRequest._id}</li></ul><p>Please review and manage this request in the system.</p><p>Regards,<br/>Blood Donor App</p>`
            });
          }
        }
        console.log(`New request notification sent to ${admins.length} admin(s)`);
      } catch (adminErr) {
        console.error('Error notifying admins of new request:', adminErr.message);
      }
    })();

    res.status(201).json(newRequest);

  } catch (err) {
    console.error('Requests route error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
