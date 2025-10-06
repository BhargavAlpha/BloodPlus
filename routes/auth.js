// Authentication Routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const https = require('https');

// Geocoding helper function
async function geocodeAddress(city, state, address) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(`${address}, ${city}, ${state}, India`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;
    
    https.get(url, { headers: { 'User-Agent': 'BloodPlus' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results && results.length > 0) {
            resolve({
              type: 'Point',
              coordinates: [parseFloat(results[0].lon), parseFloat(results[0].lat)]
            });
          } else {
            // Fallback: try just city
            const cityQuery = encodeURIComponent(`${city}, ${state}, India`);
            const cityUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${cityQuery}&limit=1`;
            
            https.get(cityUrl, { headers: { 'User-Agent': 'BloodPlus' } }, (res2) => {
              let data2 = '';
              res2.on('data', chunk => data2 += chunk);
              res2.on('end', () => {
                try {
                  const cityResults = JSON.parse(data2);
                  if (cityResults && cityResults.length > 0) {
                    resolve({
                      type: 'Point',
                      coordinates: [parseFloat(cityResults[0].lon), parseFloat(cityResults[0].lat)]
                    });
                  } else {
                    resolve({ type: 'Point', coordinates: [78.9629, 20.5937] }); // Default India center
                  }
                } catch (err) {
                  resolve({ type: 'Point', coordinates: [78.9629, 20.5937] });
                }
              });
            }).on('error', () => resolve({ type: 'Point', coordinates: [78.9629, 20.5937] }));
          }
        } catch (err) {
          resolve({ type: 'Point', coordinates: [78.9629, 20.5937] });
        }
      });
    }).on('error', () => resolve({ type: 'Point', coordinates: [78.9629, 20.5937] }));
  });
}

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, bloodGroup, city, state, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Geocode address to get coordinates
    const location = await geocodeAddress(city, state, address);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      bloodGroup,
      city,
      state,
      address,
      location
    });

    await user.save();

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        city: user.city
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        city: user.city
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
