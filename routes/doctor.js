const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const HealthRecord = require('../models/HealthRecord');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and doctor authorization to all routes
router.use(auth);
router.use(authorize('doctor'));

// Doctor Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const doctorId = req.user._id;
    
    const myPatients = await User.countDocuments({ role: 'patient' });
    const todayAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      scheduledDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    });
    const activePrescriptions = await Medication.countDocuments({
      doctor: doctorId,
      status: 'Active'
    });

    const recentAppointments = await Appointment.find({
      doctor: doctorId
    })
      .populate('patient', 'name email phone')
      .sort({ scheduledDate: 1 })
      .limit(5);

    const recentPatients = await User.find({ role: 'patient' })
      .select('name email phone medicalHistory')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      stats: {
        myPatients,
        todayAppointments,
        activePrescriptions,
        patientSatisfaction: 4.8
      },
      recentAppointments,
      recentPatients
    });
  } catch (error) {
    console.error('Doctor dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Patient Management
router.get('/patients', async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ name: 1 });
    
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/patients/:id', async (req, res) => {
  try {
    const patient = await User.findById(req.params.id)
      .select('-password');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get patient's appointments
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate('doctor', 'name specialization')
      .sort({ scheduledDate: -1 });
    
    // Get patient's medications
    const medications = await Medication.find({ patient: req.params.id })
      .populate('doctor', 'name')
      .sort({ createdAt: -1 });
    
    // Get patient's health records
    const healthRecords = await HealthRecord.find({ patient: req.params.id })
      .populate('doctor', 'name')
      .sort({ date: -1 });
    
    res.json({
      patient,
      appointments,
      medications,
      healthRecords
    });
  } catch (error) {
    console.error('Get patient details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule Management
router.get('/schedule', async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id
    })
      .populate('patient', 'name email phone')
      .sort({ scheduledDate: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/schedule', async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      doctor: req.user._id,
      createdBy: req.user._id
    });
    await appointment.save();
    
    await appointment.populate('patient', 'name email phone');
    
    res.status(201).json({
      message: 'Appointment scheduled successfully',
      appointment
    });
  } catch (error) {
    console.error('Schedule appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Prescription Management
router.get('/prescriptions', async (req, res) => {
  try {
    const prescriptions = await Medication.find({
      doctor: req.user._id
    })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/prescriptions', async (req, res) => {
  try {
    const prescription = new Medication({
      ...req.body,
      doctor: req.user._id
    });
    await prescription.save();
    
    await prescription.populate('patient', 'name email');
    
    res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health Records
router.post('/health-records', async (req, res) => {
  try {
    const healthRecord = new HealthRecord({
      ...req.body,
      doctor: req.user._id
    });
    await healthRecord.save();
    
    await healthRecord.populate('patient', 'name email');
    
    res.status(201).json({
      message: 'Health record created successfully',
      healthRecord
    });
  } catch (error) {
    console.error('Create health record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reports
router.get('/reports', async (req, res) => {
  try {
    const doctorId = req.user._id;
    
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const monthlyAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });
    const activePrescriptions = await Medication.countDocuments({
      doctor: doctorId,
      status: 'Active'
    });
    
    res.json({
      totalPatients,
      monthlyAppointments,
      activePrescriptions,
      patientSatisfaction: 4.8
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
