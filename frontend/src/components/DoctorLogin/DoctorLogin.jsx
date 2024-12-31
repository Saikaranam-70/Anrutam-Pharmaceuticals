import React, { useState } from 'react';
import './DoctorLogin.css';
import { Navigate } from 'react-router-dom';
import { URL } from '../URL/url';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [redirect, setRedirect] = useState(false); // New state for redirection

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
      const response = await fetch(`${URL}/doctors/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        setResponseMessage(result.message || 'Login successful!');
        setResponseStatus('success');
        setRedirect(true); // Set redirect to true on success
        console.log(result)
        localStorage.setItem('doctorToken', result.token)
        localStorage.setItem('doctorId', result.doctorId)
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

  // Redirect if login is successful
  if (redirect) {
    return <Navigate to="/all-doctors" />;
  }

  return (
    <div className="doctor-login">
      <h1>Doctor Login</h1>
      {loading && <div className="loading-spinner"></div>}
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

export default DoctorLogin;
