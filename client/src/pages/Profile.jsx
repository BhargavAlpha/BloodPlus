// Profile Component
import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

function Profile({ user }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    state: '',
    address: '',
    availableToDonate: true,
    lastDonationDate: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Load user profile
  const loadUserProfile = async () => {
    try {
      const response = await apiCall(`/api/donors/profile/${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          city: data.city || '',
          state: data.state || '',
          address: data.address || '',
          availableToDonate: data.availableToDonate,
          lastDonationDate: data.lastDonationDate 
            ? new Date(data.lastDonationDate).toISOString().split('T')[0] 
            : ''
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await apiCall(`/api/donors/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully!');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ color: '#dc143c', marginBottom: '20px' }}>
          ⚙️ My Profile
        </h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff0f0', borderRadius: '5px' }}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Blood Group:</strong> <span className="blood-group">{user?.bloodGroup}</span></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone"
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Enter your city"
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="Enter your state"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your address"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Last Donation Date (Optional)</label>
            <input
              type="date"
              name="lastDonationDate"
              value={formData.lastDonationDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="availableToDonate"
                checked={formData.availableToDonate}
                onChange={handleChange}
                style={{ marginRight: '10px', width: 'auto' }}
              />
              I am available to donate blood
            </label>
            <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
              Uncheck this if you're temporarily unavailable (due to recent donation, health issues, etc.)
            </small>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ color: '#dc143c', marginBottom: '15px' }}>
          📝 Important Information
        </h3>
        <ul style={{ lineHeight: '2', color: '#666' }}>
          <li>You can donate blood every 3 months (90 days)</li>
          <li>Make sure to update your last donation date</li>
          <li>Keep your contact details up to date</li>
          <li>Toggle availability if you're unable to donate temporarily</li>
          <li>You'll receive email notifications for blood requests in your area</li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
