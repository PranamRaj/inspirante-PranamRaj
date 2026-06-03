require('dotenv').config(); // 1. Load variables from .env immediately
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./middleware/auth'); // Import our login routes

const app = express();

// 2. Global Middleware configurations
app.use(cors()); // Allow your React app to communicate with this server
app.use(express.json()); // Allow the server to read incoming JSON request bodies

// 3. Strict Prefix Routing rule matching requirements
app.use('/api', authRoutes); // Mounts login path under http://localhost:5000/api/login

const PORT = process.env.PORT || 5000;

// 4. Initialize Database Connection and Start Engine
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running cleanly on port ${PORT}`));
    })
    .catch(err => {
        console.error('Database initialization failed:', err);
    });
