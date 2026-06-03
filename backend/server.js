require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events'); // 1. Import our new events file

const app = express();

app.use(cors());
app.use(express.json());

// 2. Mount both sets of routes safely behind the required /api prefix
app.use('/api', authRoutes);
app.use('/api', eventRoutes); // 3. Enables all event and dashboard routes

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running cleanly on port ${PORT}`));
    })
    .catch(err => {
        console.error('Database initialization failed:', err);
    });
