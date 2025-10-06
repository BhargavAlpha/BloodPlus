// Email Service
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email to nearby donors
async function sendEmailToNearbyDonors(bloodGroup, city, contactPerson, contactPhone) {
  try {
    // Find donors with matching blood group and location
    const donors = await User.find({
      bloodGroup,
      city: new RegExp(city, 'i'),
      availableToDonate: true
    });

    // Send email to each donor
    for (const donor of donors) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: donor.email,
        subject: '🩸 Urgent Blood Donation Request - BloodPlus',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc143c;">Blood Donation Request</h2>
            <p>Dear ${donor.name},</p>
            <p>Someone urgently needs <strong>${bloodGroup}</strong> blood in your area!</p>
            <div style="background-color: #fff0f0; padding: 15px; border-left: 4px solid #dc143c; margin: 20px 0;">
              <p><strong>Location:</strong> ${city}</p>
              <p><strong>Contact Person:</strong> ${contactPerson}</p>
              <p><strong>Contact Phone:</strong> ${contactPhone}</p>
            </div>
            <p>Your donation can save a life! Please contact the person above if you can help.</p>
            <p style="color: #666; font-size: 12px;">Thank you for being a life saver!</p>
            <p style="color: #666; font-size: 12px;">- BloodPlus Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    console.log(`✅ Emails sent to ${donors.length} donors`);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
}

module.exports = { sendEmailToNearbyDonors };
