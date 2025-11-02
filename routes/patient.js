const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const HealthRecord = require('../models/HealthRecord');
const HealthTracking = require('../models/HealthTracking');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and patient authorization to all routes
router.use(auth);
router.use(authorize('patient'));

// Patient Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const patientId = req.user._id;
    
    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patient: patientId,
      scheduledDate: { $gte: new Date() },
      status: 'Scheduled'
    })
      .populate('doctor', 'name specialization')
      .sort({ scheduledDate: 1 })
      .limit(3);
    
    // Get current medications
    const currentMedications = await Medication.find({
      patient: patientId,
      status: 'Active'
    })
      .populate('doctor', 'name')
      .sort({ createdAt: -1 });
    
    // Get recent health tracking data
    const recentVitals = await HealthTracking.find({
      patient: patientId,
      trackingType: { $in: ['Blood Pressure', 'Heart Rate', 'Weight', 'Blood Sugar'] }
    })
      .sort({ date: -1 })
      .limit(4);
    
    // Get recent lab results
    const recentLabResults = await HealthRecord.find({
      patient: patientId,
      recordType: 'Lab Result'
    })
      .populate('doctor', 'name')
      .sort({ date: -1 })
      .limit(3);
    
    res.json({
      upcomingAppointments,
      currentMedications,
      recentVitals,
      recentLabResults
    });
  } catch (error) {
    console.error('Patient dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id
    })
      .populate('doctor', 'name specialization')
      .sort({ scheduledDate: -1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/appointments', async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      patient: req.user._id
    });
    await appointment.save();
    
    await appointment.populate('doctor', 'name specialization');
    
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/appointments/:id/cancel', async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patient: req.user._id },
      { status: 'Cancelled' },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Medications
router.get('/medications', async (req, res) => {
  try {
    const medications = await Medication.find({
      patient: req.user._id
    })
      .populate('doctor', 'name')
      .sort({ createdAt: -1 });
    
    res.json(medications);
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/medications/:id/taken', async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    
    if (!medication || medication.patient.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    medication.adherence.takenDoses += 1;
    medication.adherence.totalDoses += 1;
    await medication.save();
    
    res.json({
      message: 'Medication marked as taken',
      adherence: medication.getAdherencePercentage()
    });
  } catch (error) {
    console.error('Mark medication taken error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health Records
router.get('/health-records', async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find({
      patient: req.user._id
    })
      .populate('doctor', 'name')
      .sort({ date: -1 });
    
    res.json(healthRecords);
  } catch (error) {
    console.error('Get health records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health Tracking
router.get('/health-tracking', async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;
    
    const query = { patient: req.user._id };
    if (type) {
      query.trackingType = type;
    }
    
    const trackingData = await HealthTracking.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    res.json(trackingData);
  } catch (error) {
    console.error('Get health tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/health-tracking', async (req, res) => {
  try {
    const healthTracking = new HealthTracking({
      ...req.body,
      patient: req.user._id
    });
    await healthTracking.save();
    
    res.status(201).json({
      message: 'Health data recorded successfully',
      healthTracking
    });
  } catch (error) {
    console.error('Record health tracking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile Management
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates through this route
    delete updates.role; // Don't allow role changes

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;
