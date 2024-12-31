import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after deletion
import './DoctorProfile.css';
import { URL } from '../URL/url';

const DoctorProfile = () => {
    const [doctor, setDoctor] = useState(null);
    const navigate = useNavigate();
  
    // Fetch full doctor data by ID
    const doctorId = localStorage.getItem('doctorId');
    useEffect(() => {
        const fetchDoctorDetail = async () => {
            try {
                const response = await fetch(`${URL}/doctors/${doctorId}`);
                if (!response.ok) throw new Error('Failed to fetch doctor details.');
                const data = await response.json();
                setDoctor(data);
            } catch (error) {
                alert('Error fetching doctor details. Please try again later.');
                console.error(error);
            }
        };
  
        fetchDoctorDetail();
    }, [doctorId]);
  
    const deleteDoctor = async () => {
        if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
            try {
                const response = await fetch(`${URL}/doctors/${doctorId}`, {
                    method: 'DELETE',
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Doctor deleted successfully.');
                    navigate('/'); // Navigate to the homepage or a list of doctors
                    localStorage.removeItem('doctorId')
                    localStorage.removeItem('doctorToken')
                } else {
                    alert(result.message || 'Failed to delete doctor.');
                }
            } catch (error) {
                alert('Error deleting doctor. Please try again later.');
                console.error(error);
            }
        }
    };
  
    if (!doctor) {
        return <p>Loading doctor details...</p>;
    }
  
    return (
        <div className="doctor-detail-container">
            <h1>Doctor Details</h1>
            <div className="doctor-detail-card">
                <img
                    src={`${URL}/doctors/uploads/${doctor.image || 'default.jpg'}`}
                    alt={doctor.name}
                    className="doctor-detail-image"
                />
                <div className="doctor-detail-info">
                    <h2>{doctor.name}</h2>
                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p><strong>Email:</strong> {doctor.email}</p>
                    <p><strong>Hospital:</strong> {doctor.hospitalName}</p>
                    <p><strong>Clinic Address:</strong> {doctor.clinicAddress}</p>
                    <p><strong>Consultation Fee:</strong> ₹{doctor.appointmentCost}</p>
                </div>
                <button className="toggle-btn">Edit Details</button>
                <button 
                    style={{ background: 'red' }} 
                    className="toggle-btn" 
                    onClick={deleteDoctor}
                >
                    Delete Doctor
                </button>
            </div>
        </div>
    );
};

export default DoctorProfile;
