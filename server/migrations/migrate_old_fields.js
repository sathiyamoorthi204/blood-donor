require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Donor = require('../models/Donor');

const uri = process.env.MONGO_URI;

async function run() {
  if (!uri) {
    console.error('MONGO_URI is not set. Create a .env (or set env var) and try again.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for migration');

    // Backup current donors
    const donors = await Donor.find().lean();
    const backupPath = path.join(__dirname, `backup-donors-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(donors, null, 2));
    console.log(`Backup saved to ${backupPath} (${donors.length} documents)`);

    let updatedCount = 0;

    for (const d of donors) {
      const update = {};
      const unset = {};

      if (d.Email && !d.email) {
        update.email = d.Email;
        unset.Email = "";
      }

      if (d.mobile && !d.phone) {
        update.phone = d.mobile;
        unset.mobile = "";
      }

      if (d.bloodGroup && !d.bloodType) {
        update.bloodType = d.bloodGroup;
        unset.bloodGroup = "";
      }

      if (d.city && !d.location) {
        update.location = d.city;
        unset.city = "";
      }

      // Only update if we have something to change
      if (Object.keys(update).length > 0) {
        await Donor.updateOne({ _id: d._id }, { $set: update, $unset: unset });
        updatedCount++;
      }
    }

    console.log(`Migration complete. Documents updated: ${updatedCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
