// Search Donors Component with Rapido-Style Map
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { apiCall } from '../utils/api';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Blood Drop Icon for donors - Rapido Style
const bloodIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="44" height="56" viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.4"/>
        </filter>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#E53935;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B71C1C;stop-opacity:1" />
        </linearGradient>
      </defs>
      <!-- Blood drop shape -->
      <path d="M22 4C22 4 8 20 8 32C8 40.837 14.268 48 22 48C29.732 48 36 40.837 36 32C36 20 22 4 22 4Z" 
            fill="url(#redGradient)" filter="url(#shadow)"/>
      <!-- White circle background -->
      <circle cx="22" cy="30" r="10" fill="white" opacity="0.95"/>
      <!-- Red plus sign inside -->
      <rect x="20" y="24" width="4" height="12" fill="#dc143c" rx="1"/>
      <rect x="16" y="28" width="12" height="4" fill="#dc143c" rx="1"/>
    </svg>
  `),
  iconSize: [44, 56],
  iconAnchor: [22, 56],
  popupAnchor: [0, -56],
  className: 'custom-marker-icon'
});

// Custom User Location Icon - Rapido Style (Better Pin Design)
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="48" height="58" viewBox="0 0 48 58" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="0.4"/>
        </filter>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#42A5F5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1976D2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <!-- Pulsing ring -->
      <circle cx="24" cy="24" r="18" fill="none" stroke="#2196F3" stroke-width="2" opacity="0.3">
        <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
      </circle>
      <!-- Location pin shape -->
      <path d="M24 8C17.373 8 12 13.373 12 20C12 28.5 24 42 24 42C24 42 36 28.5 36 20C36 13.373 30.627 8 24 8Z" 
            fill="url(#blueGradient)" filter="url(#shadow)"/>
      <!-- White center circle -->
      <circle cx="24" cy="20" r="6" fill="white"/>
      <!-- Blue dot inside -->
      <circle cx="24" cy="20" r="3" fill="#1976D2"/>
    </svg>
  `),
  iconSize: [48, 58],
  iconAnchor: [24, 58],
  popupAnchor: [0, -58],
  className: 'user-location-marker'
});

// Component to recenter map when position changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

function SearchDonors({ user }) {
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default: India center

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.log('Location access denied or unavailable:', error);
        }
      );
    }
  }, []);

  // Geocode function to get coordinates from city name
  const geocodeCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName.trim())}, India&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  // Function to search donors
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      let searchUrl = '/api/donors/search?';
      
      // Add blood group if selected
      if (bloodGroup && bloodGroup.trim() !== '') {
        searchUrl += `bloodGroup=${encodeURIComponent(bloodGroup)}&`;
      }
      
      // Add city if provided
      if (city && city.trim() !== '') {
        searchUrl += `city=${encodeURIComponent(city.trim())}&`;
      }
      
      // Use geolocation if available
      if (userLocation) {
        searchUrl += `latitude=${userLocation.lat}&longitude=${userLocation.lng}&`;
      }

      // Exclude current logged-in user from search results
      if (user && user.id) {
        searchUrl += `excludeUserId=${user.id}&`;
      }

      console.log('Search URL:', searchUrl);

      const response = await apiCall(searchUrl);
      const data = await response.json();
      
      console.log('Search response:', data);
      
      if (response.ok) {
        setDonors(data.donors || []);
        
        // Geocode the searched city and center map
        if (city && city.trim() !== '') {
          const cityCoords = await geocodeCity(city);
          if (cityCoords) {
            setMapCenter([cityCoords.lat, cityCoords.lng]);
          }
        } else if (userLocation) {
          setMapCenter([userLocation.lat, userLocation.lng]);
        }
      } else {
        console.error('Search failed:', data);
        setDonors([]);
      }
    } catch (err) {
      console.error('Error searching donors:', err);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate random coordinates near a city (for demo purposes since we don't have exact addresses)
  const getRandomNearbyCoords = (baseCoords, index) => {
    const offset = 0.05; // ~5km radius
    const seed = index * 137.5; // Golden angle for better distribution
    return {
      lat: baseCoords[0] + Math.sin(seed) * (Math.random() * offset),
      lng: baseCoords[1] + Math.cos(seed) * (Math.random() * offset)
    };
  };

  return (
    <div className="container">
      <div className="card search-card">
        <h2 style={{ color: '#dc143c', marginBottom: '12px', fontWeight: 600 }}>
          🔍 Find Blood Donors Near You
        </h2>
        <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
          Search for donors by blood group and location. Leave blood group empty to see all donors in a city.
        </p>

        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="select-field"
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city (e.g., Hyderabad, Mumbai)"
              className="input-field"
            />

            <button type="submit" className="btn btn-primary search-btn">
              {loading ? '🔄 Searching...' : '🔍 Search Donors'}
            </button>
          </div>
        </form>

        {userLocation && (
          <div className="location-info">
            <p>📍 <strong>Your Location Detected:</strong> {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E</p>
            <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>Map will show donors near you with real-time visualization</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching for blood donors...</p>
        </div>
      )}

      {!loading && searched && (
        <div className="map-donors-container">
          {/* Map Section - Rapido Style */}
          <div className="map-container rapido-map">
            <div className="map-header">
              <h3>🗺️ Donors Map</h3>
              <span className="donor-count-badge">{donors.length} {donors.length === 1 ? 'donor' : 'donors'} found</span>
            </div>
            <div className="map-wrapper">
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                zoomControl={true}
                style={{ height: '100%', width: '100%' }}
                className="rapido-map-container"
              >
                {/* Use CartoDB Dark Matter tiles for Rapido-like appearance */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/">CARTO</a>'
                  maxZoom={19}
                />
                <MapRecenter center={mapCenter} />
                
                {/* User Location with radius circle */}
                {userLocation && (
                  <>
                    <Circle
                      center={[userLocation.lat, userLocation.lng]}
                      radius={5000}
                      pathOptions={{
                        color: '#2196F3',
                        fillColor: '#2196F3',
                        fillOpacity: 0.1,
                        weight: 2,
                        dashArray: '5, 5'
                      }}
                    />
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                      <Popup className="custom-popup">
                        <div className="map-popup user-popup">
                          <h4>📍 You are here</h4>
                          <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                            {userLocation.lat.toFixed(6)}°N, {userLocation.lng.toFixed(6)}°E
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  </>
                )}
                
                {/* Donor Markers */}
                {donors.map((donor, index) => {
                  // Use actual coordinates if available, otherwise use random nearby
                  let coords;
                  if (donor.location && donor.location.coordinates && 
                      donor.location.coordinates[0] !== 0 && donor.location.coordinates[1] !== 0) {
                    coords = {
                      lat: donor.location.coordinates[1],
                      lng: donor.location.coordinates[0]
                    };
                  } else {
                    coords = getRandomNearbyCoords(mapCenter, index);
                  }
                  
                  return (
                    <Marker key={donor._id} position={[coords.lat, coords.lng]} icon={bloodIcon}>
                      <Popup className="custom-popup">
                        <div className="map-popup donor-popup">
                          <div className="popup-header">
                            <h4>{donor.name}</h4>
                            <span className="blood-group-mini">{donor.bloodGroup}</span>
                          </div>
                          <div className="popup-content">
                            <p>📞 <strong>Phone:</strong> {donor.phone}</p>
                            <p>📧 <strong>Email:</strong> {donor.email}</p>
                            <p>📍 <strong>City:</strong> {donor.city}, {donor.state}</p>
                            <p>🏠 <strong>Address:</strong> {donor.address}</p>
                            <div className="availability-badge">
                              {donor.availableToDonate ? (
                                <span className="available">✓ Available Now</span>
                              ) : (
                                <span className="unavailable">✗ Currently Unavailable</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          {/* Donors List Section */}
          <div className="donors-list-container">
            <div className="card donors-list-card">
              <div className="list-header">
                <h3>📋 Donor Details</h3>
                <span className="result-count">{donors.length} {donors.length === 1 ? 'result' : 'results'}</span>
              </div>

              {donors.length > 0 ? (
                <div className="donors-scroll-area">
                  {donors.map((donor, index) => (
                    <div key={donor._id} className="donor-card modern">
                      <div className="donor-card-header">
                        <div>
                          <h3>{donor.name}</h3>
                          <p className="donor-subtitle">
                            {donor.city}, {donor.state}
                            {donor.distance && ` • ${donor.distance} km away`}
                          </p>
                        </div>
                        <span className="blood-group">{donor.bloodGroup}</span>
                      </div>
                      <div className="donor-info">
                        <div className="info-item">
                          <span className="info-icon">📞</span>
                          <div>
                            <p className="info-label">Phone</p>
                            <p className="info-value">{donor.phone}</p>
                          </div>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">📧</span>
                          <div>
                            <p className="info-label">Email</p>
                            <p className="info-value">{donor.email}</p>
                          </div>
                        </div>
                        <div className="info-item full-width">
                          <span className="info-icon">🏠</span>
                          <div>
                            <p className="info-label">Address</p>
                            <p className="info-value">{donor.address}</p>
                          </div>
                        </div>
                        <div className="info-item full-width">
                          <span className="info-icon">💉</span>
                          <div>
                            <p className="info-label">Availability</p>
                            {donor.availableToDonate ? (
                              <p className="info-value" style={{ color: '#4caf50', fontWeight: 500 }}>
                                ✓ Available to donate
                              </p>
                            ) : (
                              <p className="info-value" style={{ color: '#ff6b6b', fontWeight: 500 }}>
                                ✗ Currently unavailable
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No donors found</h3>
                  <p>Try searching with different blood group or city</p>
                  <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
                    Make sure the city name is spelled correctly
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchDonors;
