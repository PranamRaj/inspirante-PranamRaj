const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    venue: { type: String, required: true },
    capacity: { type: Number, required: true },
    registrationCount: { type: Number, default: 0 }
});

const registrationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }
}, { timestamps: true });

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = {
    User: mongoose.model('User', userSchema),
    Event: mongoose.model('Event', eventSchema),
    Registration: mongoose.model('Registration', registrationSchema)
};