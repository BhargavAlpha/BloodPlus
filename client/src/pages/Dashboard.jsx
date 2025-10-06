// Dashboard Component
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../utils/api';

function Dashboard({ user }) {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's requests when component mounts
  useEffect(() => {
    loadMyRequests();
  }, []);

  // Function to load user's requests
  const loadMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiCall('/api/requests/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setMyRequests(data.requests);
      }
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card welcome-card">
        <div className="welcome-header">
          <div className="welcome-text">
            <h2>Welcome Back, {user?.name}! 👋</h2>
            <p className="welcome-subtitle">Ready to save lives today?</p>
          </div>
          <div className="blood-group-badge-large">
            <div className="blood-icon">🩸</div>
            <span className="blood-text">{user?.bloodGroup}</span>
          </div>
        </div>
        
        <div className="user-info-grid">
          <div className="info-box">
            <div className="info-icon-box">📧</div>
            <div>
              <p className="info-label">Email</p>
              <p className="info-value">{user?.email}</p>
            </div>
          </div>
          <div className="info-box">
            <div className="info-icon-box">📍</div>
            <div>
              <p className="info-label">Location</p>
              <p className="info-value">{user?.city}</p>
            </div>
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <p className="stat-number">{myRequests.length}</p>
              <p className="stat-label">Your Requests</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💉</div>
            <div className="stat-content">
              <p className="stat-number">{user?.availableToDonate ? 'Available' : 'Unavailable'}</p>
              <p className="stat-label">Donation Status</p>
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <Link to="/search-donors" style={{ textDecoration: 'none' }}>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Find Donors</h3>
            <p>Search for blood donors in your area</p>
          </div>
        </Link>

        <Link to="/create-request" style={{ textDecoration: 'none' }}>
          <div className="feature-card">
            <div className="feature-icon">🆘</div>
            <h3>Request Blood</h3>
            <p>Create an urgent blood request</p>
          </div>
        </Link>

        <Link to="/view-requests" style={{ textDecoration: 'none' }}>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>View Requests</h3>
            <p>See all active blood requests</p>
          </div>
        </Link>

        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>My Profile</h3>
            <p>Update your profile and availability</p>
          </div>
        </Link>
      </div>

      <div className="card">
        <h2 style={{ color: '#dc143c', marginBottom: '20px' }}>
          My Blood Requests
        </h2>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : myRequests.length > 0 ? (
          myRequests.map(request => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <h3>{request.patientName}</h3>
                <span className={`urgency-badge urgency-${request.urgency.toLowerCase()}`}>
                  {request.urgency}
                </span>
              </div>
              <div className="donor-info">
                <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
                <p><strong>Units Needed:</strong> {request.unitsNeeded}</p>
                <p><strong>Hospital:</strong> {request.hospitalName}</p>
                <p><strong>Location:</strong> {request.city}, {request.state}</p>
                <p><strong>Contact:</strong> {request.contactPerson}</p>
                <p><strong>Phone:</strong> {request.contactPhone}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>No requests yet</h3>
            <p>You haven't created any blood requests</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
