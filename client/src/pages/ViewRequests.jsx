// View All Blood Requests Component
import { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Load all active requests when component mounts
  useEffect(() => {
    loadRequests();
  }, []);

  // Function to load requests
  const loadRequests = async () => {
    try {
      const response = await apiCall('/api/requests/active');
      const data = await response.json();
      
      if (response.ok) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to search requests
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await apiCall(
        `/api/requests/search?bloodGroup=${filterBloodGroup}&city=${filterCity}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Error searching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ color: '#dc143c', marginBottom: '20px' }}>
          📋 All Blood Requests
        </h2>

        <div className="search-form">
          <select
            value={filterBloodGroup}
            onChange={(e) => setFilterBloodGroup(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>

          <input
            type="text"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            placeholder="Filter by city"
          />

          <button onClick={handleSearch} className="btn btn-primary">
            Filter
          </button>

          <button onClick={loadRequests} className="btn btn-secondary">
            Show All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : (
        <div className="card">
          <h3 style={{ color: '#dc143c', marginBottom: '20px' }}>
            {requests.length} Active Requests
          </h3>

          {requests.length > 0 ? (
            requests.map(request => (
              <div 
                key={request._id} 
                className={`request-card ${
                  request.urgency === 'Critical' || request.urgency === 'High' 
                    ? 'urgent' 
                    : ''
                }`}
              >
                <div className="request-header">
                  <h3>{request.patientName}</h3>
                  <span className={`urgency-badge urgency-${request.urgency.toLowerCase()}`}>
                    {request.urgency}
                  </span>
                </div>

                <div className="donor-info">
                  <p><strong>Blood Group:</strong> 
                    <span className="blood-group">{request.bloodGroup}</span>
                  </p>
                  <p><strong>Units Needed:</strong> {request.unitsNeeded}</p>
                  <p><strong>Hospital:</strong> {request.hospitalName}</p>
                  <p><strong>Location:</strong> {request.city}, {request.state}</p>
                  <p><strong>Contact Person:</strong> {request.contactPerson}</p>
                  <p><strong>Contact Phone:</strong> {request.contactPhone}</p>
                  <p><strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <a href={`tel:${request.contactPhone}`}>
                    <button className="btn btn-success">
                      📞 Call Now
                    </button>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>No active requests</h3>
              <p>There are no blood requests matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewRequests;
