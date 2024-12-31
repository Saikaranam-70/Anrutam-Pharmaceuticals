import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Doctor.css';
import { URL } from '../URL/url';

const Doctor = () => {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctorDetail = async () => {
            const response = await fetch(`${URL}/doctors/${doctorId}`);
            const data = await response.json();
            setDoctor(data);
        };

        fetchDoctorDetail();
    }, [doctorId]);

    const handleBookAppointment = async () => {
        if (appointmentDate && appointmentTime) {
            const patientId = localStorage.getItem('userId');
            const response = await fetch(`${URL}/appointments/user/${patientId}/appointments
`);
            const previousAppointments = await response.json();
            const isFirstAppointment =
                previousAppointments.message === "No appointments found for this user";
            
            console.log(isFirstAppointment)
            navigate('/checkout', {
                state: {
                    doctorId,
                    appointmentDate: `${appointmentDate}T${appointmentTime}:00Z`,
                    doctorName: doctor.name,
                    appointmentCost: doctor.appointmentCost,
                    isFirstAppointment,
                    
                },
            });
        } else {
            alert("Please select both date and time.");
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

                    
                    <div>
                        <label htmlFor="appointment-date">Select Date:</label>
                        <input
                            type="date"
                            id="appointment-date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="appointment-time">Select Time:</label>
                        <input
                            type="time"
                            id="appointment-time"
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                        />
                    </div>

                    <button className='toggle-btn' onClick={handleBookAppointment}>Book Appointment</button>
                </div>
            </div>
        </div>
    );
};

export default Doctor;
