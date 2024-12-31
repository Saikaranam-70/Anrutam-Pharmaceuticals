import React, { useState } from 'react';
import './UserRegister.css';
import { NavLink } from 'react-router-dom';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    setResponseStatus('');

    try {
      const response = await fetch('http://localhost:5000/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setResponseMessage(result.message || 'Registration successful!');
        setResponseStatus('success');
        <NavLink to='/user-login' />
      } else {
        setResponseMessage(result.message || 'Registration failed.');
        setResponseStatus('error');
      }
    } catch (error) {
      setResponseMessage('An unexpected error occurred. Please try again.');
      setResponseStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-register">
      <h1>User Registration</h1>
      {loading && <div className="loading-spinner">Loading...</div>}
      {responseMessage && (
        <div className={`response-message ${responseStatus}`}>
          {responseMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default UserRegister;
