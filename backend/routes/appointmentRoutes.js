const express = require('express');
const { bookAppointment, generateReport, getPatientFinancialReport, getAppointmentsByUserId, getAppointmentsByDoctorId } = require('../controllers/appointmentController');


const router = express.Router();

// POST /appointments
router.post('/', bookAppointment);

// GET /appointments/report/:doctorId
router.get('/report/:doctorId', generateReport);
router.get('/:patientId/financial-report', getPatientFinancialReport)
router.get('/user/:userId/appointments', getAppointmentsByUserId)
router.get('/doctor/:doctorId/appointments', getAppointmentsByDoctorId)


module.exports = router;
