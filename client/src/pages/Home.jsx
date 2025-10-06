// Home Page Component
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>🩸 Save Lives, Donate Blood</h1>
        <p>Connect blood donors with those in need</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <Link to="/register">
            <button className="btn btn-primary">Register as Donor</button>
          </Link>
          <Link to="/search-donors">
            <button className="btn btn-secondary">Find Blood</button>
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card enhanced">
          <div className="feature-icon-large">👤</div>
          <h3>Register</h3>
          <p>Create your profile and save your blood group and location details</p>
          <div className="feature-highlight">Join our lifesaving community</div>
        </div>

        <div className="feature-card enhanced">
          <div className="feature-icon-large">🔍</div>
          <h3>Search</h3>
          <p>Find blood donors by blood group and location easily</p>
          <div className="feature-highlight">Real-time donor mapping</div>
        </div>

        <div className="feature-card enhanced">
          <div className="feature-icon-large">📧</div>
          <h3>Notify</h3>
          <p>Automatic email notifications to nearby donors when blood is needed</p>
          <div className="feature-highlight">Instant alerts system</div>
        </div>

        <div className="feature-card enhanced urgent">
          <div className="feature-icon-large">🆘</div>
          <h3>SOS Request</h3>
          <p>Create urgent blood requests with priority levels</p>
          <div className="feature-highlight urgent-badge">Emergency response</div>
        </div>
      </div>

      <div className="why-donate-section">
        <h2 className="section-title">Why Donate Blood?</h2>
        <p className="section-subtitle">Every donation makes a difference. Here's why your contribution matters:</p>
        
        <div className="why-donate-grid">
          <div className="why-card">
            <div className="why-icon">💪</div>
            <h3>Save Multiple Lives</h3>
            <p>One donation can save up to 3 lives by separating into red cells, platelets, and plasma</p>
          </div>

          <div className="why-card">
            <div className="why-icon">🏥</div>
            <h3>Constant Demand</h3>
            <p>Someone needs blood every 2 seconds. Your donation could be the one that saves a life</p>
          </div>

          <div className="why-card">
            <div className="why-icon">❤️</div>
            <h3>Health Benefits</h3>
            <p>Regular donation reduces iron overload, improves cardiovascular health, and burns calories</p>
          </div>

          <div className="why-card">
            <div className="why-icon">🌟</div>
            <h3>Be a Hero</h3>
            <p>Experience the joy of knowing you've made a direct impact on someone's survival</p>
          </div>

          <div className="why-card">
            <div className="why-icon">🔄</div>
            <h3>Cannot Be Made</h3>
            <p>Blood cannot be manufactured artificially. Donation is the only source available</p>
          </div>

          <div className="why-card">
            <div className="why-icon">⚡</div>
            <h3>Quick & Easy</h3>
            <p>The entire process takes only 30-45 minutes and you can donate every 3 months</p>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">3</div>
            <div className="stat-label">Lives Saved per Donation</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">45</div>
            <div className="stat-label">Minutes Process Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">12</div>
            <div className="stat-label">Weeks to Replenish</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">470ml</div>
            <div className="stat-label">Blood Per Donation</div>
          </div>
        </div>
      </div>

      <div className="blood-groups-section">
        <h2 className="section-title">All Blood Groups Supported</h2>
        <p className="section-subtitle">We connect donors and recipients across all blood types</p>
        <div className="blood-groups-grid">
          <div className="blood-group-item">
            <span className="blood-group">A+</span>
            <p>A Positive</p>
          </div>
          <div className="blood-group-item">
            <span className="blood-group">A-</span>
            <p>A Negative</p>
          </div>
          <div className="blood-group-item">
            <span className="blood-group">B+</span>
            <p>B Positive</p>
          </div>
          <div className="blood-group-item">
            <span className="blood-group">B-</span>
            <p>B Negative</p>
          </div>
          <div className="blood-group-item">
            <span className="blood-group">AB+</span>
            <p>AB Positive</p>
          </div>
          <div className="blood-group-item">
            <span className="blood-group">AB-</span>
            <p>AB Negative</p>
          </div>
          <div className="blood-group-item">
            <span className="blood-group">O+</span>
            <p>O Positive</p>
          </div>
          <div className="blood-group-item">
            <span className="blood-group">O-</span>
            <p>O Negative (Universal)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
