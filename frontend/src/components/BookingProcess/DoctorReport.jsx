
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { URL } from '../URL/url';

const DoctorReport = () => {
    const { doctorId } = useParams(); 
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorReport = async () => {
            try {
                const response = await fetch(`${URL}/appointments/report/${doctorId}`);
                if (!response.ok) throw new Error('Failed to fetch doctor report');
                const data = await response.json();
                setReport(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorReport();
    }, [doctorId]);

    if (loading) return <p>Loading doctor report...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="doctor-report-container">
            <h1>Doctor Report</h1>
            <p><strong>Total Appointments:</strong> {report.totalAppointments}</p>
            <p><strong>Total Earnings:</strong> ₹{report.totalEarnings}</p>
            <p><strong>Total Discounts Given:</strong> ₹{report.totalDiscounts}</p>
            <h2>Appointments</h2>
            <ul>
                {report.appointments.map((appointment) => (
                    <li key={appointment._id}>
                        Patient: {appointment.patientId.name}, Date: {new Date(appointment.date).toLocaleString()}, Amount: ₹{appointment.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DoctorReport;
