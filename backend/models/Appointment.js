const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  discountApplied: { type: Boolean, default: false },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
