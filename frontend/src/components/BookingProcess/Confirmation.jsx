
import React from 'react';
import { useLocation } from 'react-router-dom';

const Confirmation = () => {
    const location = useLocation();
    const appointmentDetails = location.state;

    return (
        <div className="confirmation-container">
            <h1>Appointment Confirmed!</h1>
            <p><strong>Your Appointment ID:</strong> {appointmentDetails._id}</p>
            <p><strong>Doctor ID:</strong> {appointmentDetails.doctorId}</p>
            <p><strong>Date & Time:</strong> {new Date(appointmentDetails.date).toLocaleString()}</p>
            
        </div>
    );
};

export default Confirmation;
