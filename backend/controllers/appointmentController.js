const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Wallet = require('../models/Wallet');
// const { addAppointment } = require('./doctorController'); // Assuming this is required for adding appointments to doctor

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date } = req.body;

    // Fetch doctor, patient, and wallet
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const wallet = await Wallet.findOne({ userId: patientId });
    if (!wallet) return res.status(400).json({ message: 'Wallet not found or insufficient balance' });

    // Check for existing appointment
    const existingAppointment = await Appointment.findOne({ doctorId, patientId });
    const isFirstTime = !existingAppointment;

    // Calculate discounted amount
    const amount = doctor.appointmentCost;
    const discountedAmount = isFirstTime ? amount * 0.9 : amount;

    if (wallet.balance < discountedAmount) {
      return res.status(400).json({ message: 'Insufficient wallet balance for this appointment' });
    }

    // Create and save appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      amount: discountedAmount,
      discountApplied: isFirstTime,
    });
    await appointment.save();

    // Deduct wallet balance and log transaction
    wallet.balance -= discountedAmount;
    wallet.transactions.push({
      type: 'debit',
      amount: discountedAmount,
      description: 'Appointment booking',
      date: new Date(),
    });
    await wallet.save();

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Error booking appointment', error });
  }
};



const getPatientFinancialReport = async (req, res) => {
  try {
    const { patientId } = req.params;

    const wallet = await Wallet.findOne({ userId: patientId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const appointments = await Appointment.find({ patientId }).populate('doctorId', 'name specialization');
    const totalSpent = appointments.reduce((sum, appt) => sum + appt.amount, 0);

    res.status(200).json({
      walletBalance: wallet.balance,
      totalSpent,
      transactions: wallet.transactions,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching financial report', error });
  }
};


  
const generateReport = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({ doctorId }).populate('patientId', 'name email');
    const totalEarnings = appointments.reduce((sum, appt) => sum + appt.amount, 0);
    const totalDiscounts = appointments.reduce((sum, appt) => (appt.discountApplied ? sum + (appt.amount / 0.9 - appt.amount) : sum), 0);

    res.status(200).json({
      doctorId,
      totalAppointments: appointments.length,
      totalEarnings,
      totalDiscounts,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
};
const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request parameters

    const appointments = await Appointment.find({ patientId: userId }).populate('doctorId', 'name specialization');
    
    if (!appointments.length) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }

    res.status(200).json(appointments); // Return found appointments
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

// Function to get all appointments by doctor ID
const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params; // Get doctorId from request parameters

    const appointments = await Appointment.find({doctorId: doctorId }).populate('patientId', 'name email');
    
    if (!appointments.length) {
      return res.status(404).json({ message: 'No appointments found for this doctor' });
    }

    res.status(200).json(appointments); // Return found appointments
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params; // Get appointment ID from request parameters

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Find the user's wallet to refund the amount
    const wallet = await Wallet.findOne({ userId: appointment.patientId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for this user' });
    }

    // Refund the amount to the wallet
    wallet.balance += appointment.amount;
    wallet.transactions.push({
      type: 'credit',
      amount: appointment.amount,
      description: 'Appointment cancellation refund',
      date: new Date(),
    });
    await wallet.save();

    // Remove the appointment
    await Appointment.findByIdAndDelete(appointmentId);

    res.status(200).json({ message: 'Appointment canceled successfully, refund processed', appointmentId });
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ message: 'Error canceling appointment', error });
  }
};


module.exports = {
  bookAppointment,
  generateReport,
  cancelAppointment,
  getPatientFinancialReport,
  getAppointmentsByUserId, // Export new function
  getAppointmentsByDoctorId // Export new function
};