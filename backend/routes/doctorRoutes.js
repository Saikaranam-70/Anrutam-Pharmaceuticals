const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/authMiddleware');
const path = require('path')

// Register and login
router.post('/register', doctorController.registerDoctor);
router.post('/login', doctorController.loginDoctor);

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById); 
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '..', 'uploads', imageName);
    console.log("Image path:", imagePath); // Check the image path
    res.setHeader('Content-Type', 'image/jpg');
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error("Error serving image:", err);
            res.status(500).send("Error serving image");
        }
    });
});

// Protected routes for authenticated doctors
router.use(authenticateToken); // Apply token verification for the following routes

// CRUD operations for doctors
// Get all doctors
// Get a specific doctor
router.put('/:id', doctorController.updateDoctor); // Update a doctor's details
router.delete('/:id', doctorController.deleteDoctor); // Delete a doctor

// Appointment management
router.post('/:id/appointments', doctorController.addAppointment); // Add an appointment
router.delete('/:id/appointments', doctorController.removeAppointment); // Remove an appointment

module.exports = router;
