// FinancialReport.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FinancialReport = () => {
    // const { patientId } = useParams(); 
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const patientId = localStorage.getItem('userId')
    useEffect(() => {
        const fetchFinancialReport = async () => {
            try {
                const response = await fetch(`${URL}/appointments/${patientId}/financial-report`);
                if (!response.ok) throw new Error('Failed to fetch financial report');
                const data = await response.json();
                setReport(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFinancialReport();
    }, [patientId]);

    if (loading) return <p>Loading financial report...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="financial-report-container">
            <h1>Financial Report</h1>
            <p><strong>Wallet Balance:</strong> ₹{report.walletBalance}</p>
            <p><strong>Total Spent:</strong> ₹{report.totalSpent}</p>
            <h2>Transactions</h2>
            <ul>
                {report.transactions.map((transaction, index) => (
                    <li key={index}>
                        {transaction.description} - ₹{transaction.amount} ({transaction.type})
                    </li>
                ))}
            </ul>
            <h2>Appointments</h2>
            <ul>
                {report.appointments.map((appointment) => (
                    <li key={appointment._id}>
                        Doctor: Dr. {appointment.doctorId.name}, Date: {new Date(appointment.date).toLocaleString()}, Amount: ₹{appointment.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FinancialReport;
