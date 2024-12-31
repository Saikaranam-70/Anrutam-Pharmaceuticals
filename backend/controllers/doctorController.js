const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
  }
});

const upload = multer({ storage: storage });

// Register a new doctor
const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, hospitalName, clinicAddress, appointmentCost } = req.body;
    const image = req.file ? req.file.filename : undefined;

    console.log(image)
    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new doctor
    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      specialization,
      hospitalName,
      clinicAddress,
      appointmentCost,
      appointments: [],
      image
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor registered successfully', doctor: newDoctor });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error registering doctor', error });
  }
};

// Login a doctor
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the doctor by email
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const doctorId  = doctor._id;

    res.status(200).json({ message: 'Login successful', token, doctorId });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
};

// Get a doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error });
  }
};

// Update doctor details
const updateDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, hospitalName, clinicAddress, availableSlots, appointmentCost } = req.body;

    // Hash the new password if provided
    const updatedFields = { name, email, specialization, hospitalName, clinicAddress, availableSlots, appointmentCost };
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    // Update the doctor
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error });
  }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error });
  }
};

// Add an appointment to a doctor's list
const addAppointment = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    doctor.appointments.push(appointmentId);
    await doctor.save();

    res.status(200).json({ message: 'Appointment added successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error adding appointment', error });
  }
};

// Remove an appointment from a doctor's list
const removeAppointment = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { appointmentId } = req.body;
    doctor.appointments = doctor.appointments.filter(id => id.toString() !== appointmentId);
    await doctor.save();

    res.status(200).json({ message: 'Appointment removed successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error removing appointment', error });
  }
};

module.exports = {
  registerDoctor : [upload.single('image'), registerDoctor],
  loginDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  addAppointment,
  removeAppointment,
};
