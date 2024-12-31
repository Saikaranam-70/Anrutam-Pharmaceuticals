import React, { useEffect, useState } from 'react';
import './DoctorAppointments.css';
import { URL } from '../URL/url';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const doctorId = localStorage.getItem('doctorId')
      try {
        const response = await fetch(`${URL}/appointments/doctor/${doctorId}/appointments`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${URL}/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
      // Remove the canceled appointment from the state
      setAppointments(appointments.filter(appointment => appointment._id !== appointmentId));
      alert('Appointment canceled successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Error state
  }

  return (
    <div className="doctor-appointments">
      <h1>Your Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments booked.</p>
      ) : (
        <ul className="appointment-list">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="appointment-item">
              <h2>{appointment.patientId.name}</h2>
              <p><strong>Email:</strong> {appointment.patientId.email}</p>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
              <p><strong>Discount Applied:</strong> {appointment.discountApplied ? 'Yes' : 'No'}</p>
              <p><strong>Amount:</strong> ${appointment.amount}</p>
              <button onClick={() => handleCancelAppointment(appointment._id)} className="cancel-button">Cancel Appointment</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorAppointments;
