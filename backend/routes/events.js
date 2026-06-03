const express = require('express');
const router = express.Router();
const { Event, Registration } = require('../models/schema');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/events', verifyToken, async (req, res) => {
    try {
        const events = await Event.find();
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/events', verifyToken, requireAdmin, async (req, res) => {
    const { title, date, venue, capacity } = req.body;

    // Validate that all fields were provided
    if (!title || !date || !venue || !capacity) {
        return res.status(400).json({ message: 'All event fields are required.' });
    }

    try {
        const newEvent = new Event({ title, date, venue, capacity });
        await newEvent.save();
        return res.status(201).json(newEvent);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/register', verifyToken, async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user.id;

    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required.' });
    }

    try {
        // Ensure event exists and capacity is respected
        const event = await Event.findById(eventId).select('capacity registrationCount');
        if (!event) return res.status(404).json({ message: 'Event not found.' });

        // Prevent duplicate registration
        const existingRegistration = await Registration.findOne({ userId, eventId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'You have already registered for this event.' });
        }

        // Prevent registration if event is full
        if ((event.registrationCount || 0) >= (event.capacity || 0)) {
            return res.status(400).json({ message: 'Event capacity is full.' });
        }

        const registration = new Registration({ userId, eventId });
        await registration.save();
        await Event.findByIdAndUpdate(eventId, { $inc: { registrationCount: 1 } });
        return res.status(200).json({ message: 'Registered for the event successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const { eventId } = req.params;
        const totalEvents = await Event.countDocuments();
        const totalRegistrationsCount = await Registration.countDocuments();
        const myRegistrations = await Registration.find({ userId: req.user.id }).populate('eventId');
        const eventDoc = await Event.findById(eventId).select('registrationCount');
        const currentRegistrationCount = eventDoc ? (eventDoc.registrationCount || 0) : 0;
        const registrations = await Registration.find({ eventId }).populate('userId', 'name username');

        return res.status(200).json({
            totalEvents,
            totalRegistrationsCount,
            userRegistrationCount: myRegistrations.length,
            totalRegistrations: currentRegistrationCount,
            registeredStudents: registrations.map(reg => reg.userId).filter(Boolean),
            registeredEvents: myRegistrations.map(r => r.eventId).filter(Boolean)
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get registrations for a specific event (admin only)
router.get('/events/:id/registrations', verifyToken, requireAdmin, async (req, res) => {
    try {
        const eventId = req.params.id;
        if (!eventId) return res.status(400).json({ message: 'Event ID is required.' });

        const regs = await Registration.find({ eventId }).populate('userId', 'name username');
        const students = regs.map(r => ({
            id: r.userId?._id,
            name: r.userId?.name || r.userId?.username,
            username: r.userId?.username,
            registeredAt: r.createdAt
        }));
        return res.status(200).json({ students, count: students.length });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
