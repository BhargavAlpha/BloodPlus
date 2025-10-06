// Donor Routes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Search donors by blood group and location
router.get('/search', async (req, res) => {
  try {
    const { bloodGroup, city, latitude, longitude, excludeUserId } = req.query;

    console.log('Search params:', { bloodGroup, city, latitude, longitude, excludeUserId });

    let donors = [];
    
    // Build query object
    const query = {};
    
    // Add blood group filter if provided
    if (bloodGroup && bloodGroup.trim() !== '') {
      query.bloodGroup = bloodGroup;
    }
    
    // Add city filter if provided
    if (city && city.trim() !== '') {
      query.city = new RegExp(city.trim(), 'i');
    }

    // Exclude current user from results
    if (excludeUserId && excludeUserId.trim() !== '') {
      query._id = { $ne: excludeUserId };
    }

    console.log('Query object:', query);

    // Find all matching donors
    donors = await User.find(query).select('-password');
    
    console.log('Found donors before filtering:', donors.length);

    // If coordinates provided, calculate distance and sort by proximity
    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      
      // Calculate distance for each donor
      donors = donors.map(donor => {
        if (donor.location && donor.location.coordinates && 
            donor.location.coordinates[0] !== 0 && donor.location.coordinates[1] !== 0) {
          const donorLng = donor.location.coordinates[0];
          const donorLat = donor.location.coordinates[1];
          
          // Haversine formula to calculate distance
          const R = 6371; // Earth's radius in km
          const dLat = (donorLat - userLat) * Math.PI / 180;
          const dLon = (donorLng - userLng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(userLat * Math.PI / 180) * Math.cos(donorLat * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c;
          
          return { ...donor.toObject(), distance: distance.toFixed(2) };
        }
        return { ...donor.toObject(), distance: null };
      });
      
      // Sort by distance (nulls last)
      donors.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return parseFloat(a.distance) - parseFloat(b.distance);
      });
    }

    // Filter only available donors
    const availableDonors = donors.filter(donor => donor.availableToDonate);

    console.log('Available donors:', availableDonors.length);

    res.json({
      count: availableDonors.length,
      donors: availableDonors,
      total: donors.length
    });
  } catch (error) {
    console.error('Search error:', error);
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
