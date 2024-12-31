
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './Checkout.css'; 

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { doctorId, appointmentDate, doctorName, appointmentCost, isFirstAppointment } = location.state;

    
    const discountRate = 0.10; 
    const discountedAmount = isFirstAppointment ? appointmentCost * (1 - discountRate) : appointmentCost;

    const handleConfirmAppointment = async () => {
        const patientId = localStorage.getItem('userId'); // Ensure this is set correctly

        console.log(patientId)
        const appointmentData = {
            doctorId,
            patientId,
            date: appointmentDate,
        };

        try {
            const response = await fetch(`${URL}/appointments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });
            console.log(response)
            if (!response.ok) {
                alert("Add Funds to Wallet")
                const errorData = await response.json();
                toast.error(errorData.message); // Use Toastify for error message
                throw new Error('Failed to book appointment');
                
                
            }
            if(response.status == 400){
                alert("Insuffisient Funds in Wallet Please Add Money")
            }
            console.log("called")
            const data = await response.json();
            console.log('Appointment booked successfully:', data);
            navigate('/confirmation', { state: data.appointment });
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <h2>Confirm Your Appointment</h2>
            <p><strong>Doctor:</strong> {doctorName}</p>
            <p><strong>Date & Time:</strong> {new Date(appointmentDate).toLocaleString()}</p>
            
            
            {isFirstAppointment ? (
                <p className="original-price">
                    <span className="crossed">₹{appointmentCost}</span>
                </p>
            ) : (
                <p className="original-price">₹{appointmentCost}</p>
            )}

            
            <p><strong>Discounted Amount:</strong> ₹{discountedAmount.toFixed(2)}</p>

            <button onClick={handleConfirmAppointment}>Confirm Appointment</button>

            
        </div>
    );
};

export default Checkout;
