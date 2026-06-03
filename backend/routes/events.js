const express = require('express');
const router = express.Router();
const { Event, Registration } = require('../models/schemas');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// 1. GET /api/events -> Fetch all active events (For both Student & Admin)
router.get('/events', verifyToken, async (req, res) => {
    try {
        const events = await Event.find();
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// 2. POST /api/events -> Create a brand new college event (Strictly Admin only)
router.post('/events', verifyToken, requireAdmin, async (req, res) => {
    const { title, date, venue, capacity } = req.body;

    // Validate that all fields were provided
    if (!title || !date || !venue || !capacity) {
        return res.status(400).json({ message: 'All event fields are required.' });
    }

    try {
        const newEvent = new Event({ title, date, venue, capacity });
        await newEvent.save();
        return res.status(201).json(newEvent); // 201 means "Created successfully"
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// 3. POST /api/register -> Register a student for an event (Student/User only)
router.post('/register', verifyToken, async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user.id; // Pulled safely from verified JWT payload context

    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required.' });
    }

    try {
        // Check if the student already signed up for this specific event
        const existingRegistration = await Registration.findOne({ userId, eventId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'You have already registered for this event.' });
        }

        // Save the new registration link record
        const registration = new Registration({ userId, eventId });
        await registration.save();
        return res.status(200).json({ message: 'Registered for the event successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// 4. GET /api/dashboard -> Fetch counter metrics and user specific sign-ups dynamically
router.get('/dashboard', verifyToken, async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const totalRegistrationsCount = await Registration.countDocuments(); // Useful for global admin summary

        // Fetch individual student registrations and pull the referenced event schema information
        const myRegistrations = await Registration.find({ userId: req.user.id }).populate('eventId');

        return res.status(200).json({
            totalEvents,
            totalRegistrationsCount,
            userRegistrationCount: myRegistrations.length,
            // Map out clean arrays of event sub-documents filtering out missing or deleted references
            registeredEvents: myRegistrations.map(r => r.eventId).filter(Boolean)
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
