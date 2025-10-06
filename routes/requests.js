// Blood Request Routes
const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendEmailToNearbyDonors } = require('../utils/emailService');

// Create new blood request
router.post('/create', auth, async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsNeeded,
      hospitalName,
      city,
      state,
      contactPerson,
      contactPhone,
      urgency
    } = req.body;

    const request = new Request({
      patientName,
      bloodGroup,
      unitsNeeded,
      hospitalName,
      city,
      state,
      contactPerson,
      contactPhone,
      urgency,
      requestedBy: req.userId
    });

    await request.save();

    // Send email to nearby donors
    await sendEmailToNearbyDonors(bloodGroup, city, contactPerson, contactPhone);

    res.status(201).json({
      message: 'Blood request created successfully',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all active requests
router.get('/active', async (req, res) => {
  try {
    const requests = await Request.find({ status: 'Active' })
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search requests by blood group and location
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;

    const query = { status: 'Active' };
    
    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }
    
    if (city) {
      query.city = new RegExp(city, 'i');
    }

    const requests = await Request.find(query)
      .populate('requestedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update request status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: 'Request status updated',
      request
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await Request.find({ requestedBy: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      count: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
