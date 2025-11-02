const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const HealthRecord = require('../models/HealthRecord');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(auth);
router.use(authorize('admin'));

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const activeMedications = await Medication.countDocuments({ status: 'Active' });

    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(5);

    const systemHealth = {
      serverPerformance: 85,
      databaseStatus: 92,
      storageUsage: 67
    };

    res.json({
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        activeMedications
      },
      recentAppointments,
      systemHealth
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Patient Management
router.get('/patients', async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/patients', async (req, res) => {
  try {
    const patient = new User({
      ...req.body,
      role: 'patient'
    });
    await patient.save();
    
    res.status(201).json({
      message: 'Patient created successfully',
      patient: patient.toJSON()
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/patients/:id', async (req, res) => {
  try {
    const patient = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/patients/:id', async (req, res) => {
  try {
    const patient = await User.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Doctor Management
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/doctors', async (req, res) => {
  try {
    const doctor = new User({
      ...req.body,
      role: 'doctor'
    });
    await doctor.save();
    
    res.status(201).json({
      message: 'Doctor created successfully',
      doctor: doctor.toJSON()
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/doctors/:id', async (req, res) => {
  try {
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json({
      message: 'Doctor updated successfully',
      doctor
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/doctors/:id', async (req, res) => {
  try {
    const doctor = await User.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Treatment Scheduling
router.get('/treatments', async (req, res) => {
  try {
    const treatments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ scheduledDate: 1 });
    
    res.json(treatments);
  } catch (error) {
    console.error('Get treatments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/treatments', async (req, res) => {
  try {
    const treatment = new Appointment({
      ...req.body,
      createdBy: req.user._id
    });
    await treatment.save();
    
    await treatment.populate('patient', 'name email');
    await treatment.populate('doctor', 'name specialization');
    
    res.status(201).json({
      message: 'Treatment scheduled successfully',
      treatment
    });
  } catch (error) {
    console.error('Create treatment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Medicine Scheduling
router.get('/medicines', async (req, res) => {
  try {
    const medicines = await Medication.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    
    res.json(medicines);
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/medicines', async (req, res) => {
  try {
    const medicine = new Medication(req.body);
    await medicine.save();
    
    await medicine.populate('patient', 'name email');
    await medicine.populate('doctor', 'name specialization');
    
    res.status(201).json({
      message: 'Medicine prescribed successfully',
      medicine
    });
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
