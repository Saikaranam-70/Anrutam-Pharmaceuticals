import React, { useState } from 'react';
import './DoctorRegister.css';
import { URL } from '../URL/url';

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    appointmentCost: '',
    password: '',
    hospitalName: '',
    clinicAddress: '',
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    setResponseStatus('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${URL}/doctors/register`, {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await response.json();

      if (response.ok) {
        setResponseMessage(result.message || 'Registration successful!');
        setResponseStatus('success');
        resetForm();
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

  // Reset form data after successful registration
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      specialization: '',
      appointmentCost: '',
      password: '',
      hospitalName: '',
      clinicAddress: '',
      image: null,
    });
  };

  return (
    <div className="doctor-register">
      <h1>Doctor Registration</h1>
      {loading && <div className="loading-spinner"></div>}
      {responseMessage && (
        <div className={`response-message ${responseStatus}`}>
          {responseMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="appointmentCost"
          placeholder="Appointment Cost"
          value={formData.appointmentCost}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="hospitalName"
          placeholder="Hospital Name"
          value={formData.hospitalName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="clinicAddress"
          placeholder="Clinic Address"
          value={formData.clinicAddress}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default DoctorRegister;
