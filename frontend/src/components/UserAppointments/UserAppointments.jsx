import React, { useEffect, useState } from 'react';
import './UserAppointments.css';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const userId = localStorage.getItem('userId') // Replace with dynamic user ID if needed
      try {
        const response = await fetch(`http://localhost:5000/appointments/user/${userId}/appointments`);
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

  const handleCancelBooking = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/appointments/cancel/${appointmentId}`, {
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
    <div className="user-appointments">
      <h1>Your Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments booked.</p>
      ) : (
        <ul className="appointment-list">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="appointment-item">
              <h2>{appointment.doctorId.name}</h2>
              <p><strong>Specialization:</strong> {appointment.doctorId.specialization}</p>
              <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
              <p><strong>Amount:</strong> ${appointment.amount}</p>
              <p><strong>Discount Applied:</strong> {appointment.discountApplied ? 'Yes' : 'No'}</p>
              <button onClick={() => handleCancelBooking(appointment._id)} className="cancel-button">Cancel Booking</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserAppointments;
