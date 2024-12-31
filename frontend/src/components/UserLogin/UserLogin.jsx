import React, { useState } from 'react';
import './UserLogin.css';
import { Navigate } from 'react-router-dom';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [redirect, setRedirect] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRedirect(true);
    setResponseMessage('');
    setResponseStatus('');

    try {
      const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        // Store userId and token in localStorage
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('userToken', result.token);
        
        setResponseMessage(result.message || 'Login successful!');
        setResponseStatus('success');
        window.location.reload;
      } else {
        setResponseMessage(result.message || 'Login failed.');
        setResponseStatus('error');
      }
    } catch (error) {
      setResponseMessage('An unexpected error occurred. Please try again.');
      setResponseStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/all-doctors" />;
  }

  return (
    <div className="user-login">
      <h1>User Login</h1>
      {loading && <div className="loading-spinner">Loading...</div>}
      {responseMessage && (
        <div className={`response-message ${responseStatus}`}>
          {responseMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
