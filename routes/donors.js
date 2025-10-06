// Donor Routes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Search donors by blood group and location (with geospatial search)
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, city, latitude, longitude, radius } = req.query;

    let donors;

    // If coordinates are provided, use geospatial search
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const searchRadius = parseInt(radius) || 50000; // Default 50km in meters

      const query = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat] // GeoJSON uses [longitude, latitude]
            },
            $maxDistance: searchRadius
          }
        }
      };

      // Add blood group filter if provided
      if (bloodGroup) {
        query.bloodGroup = bloodGroup;
      }

      donors = await User.find(query).select('-password');
    } else {
      // Fallback to city-based search
      const query = {};
      
      if (bloodGroup) {
        query.bloodGroup = bloodGroup;
      }
      
      if (city) {
        query.city = new RegExp(city.trim(), 'i');
      }

      donors = await User.find(query).select('-password');
    }

    // Filter only available donors
    const availableDonors = donors.filter(donor => donor.availableToDonate);

    res.json({
      count: availableDonors.length,
      donors: availableDonors
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get donor profile
router.get('/profile/:id', async (req, res) => {
  try {
    const donor = await User.findById(req.params.id).select('-password');
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update donor profile
router.put('/profile/:id', auth, async (req, res) => {
  try {
    const { name, phone, city, state, address, availableToDonate, lastDonationDate } = req.body;

    const donor = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, city, state, address, availableToDonate, lastDonationDate },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      donor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all donors (for admin/stats)
router.get('/all', async (req, res) => {
  try {
    const donors = await User.find().select('-password');
    res.json({ count: donors.length, donors });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
