// Main App Component
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchDonors from './pages/SearchDonors';
import CreateRequest from './pages/CreateRequest';
import ViewRequests from './pages/ViewRequests';
import Profile from './pages/Profile';

function App() {
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in when app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Function to handle login
  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/login" 
            element={
              isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
            } 
          />
          
          <Route 
            path="/register" 
            element={
              isLoggedIn ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/search-donors" 
            element={
              isLoggedIn ? <SearchDonors /> : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/create-request" 
            element={
              isLoggedIn ? <CreateRequest user={user} /> : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/view-requests" 
            element={
              isLoggedIn ? <ViewRequests /> : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              isLoggedIn ? <Profile user={user} /> : <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
