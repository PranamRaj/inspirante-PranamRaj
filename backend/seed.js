require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models/schema');

const seedDatabase = async () => {
    try {
        // 1. Establish database connection
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 2. Clear out any existing users to avoid conflicts
        await User.deleteMany({});
        console.log('Cleared existing user data.');

        // 3. Encrypt passwords securely
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedUserPassword = await bcrypt.hash('user123', 10);

        // 4. Create an Admin and a Student baseline record
        await User.create([
            {
                username: 'admin',
                password: hashedAdminPassword,
                name: 'System Admin',
                role: 'admin'
            },
            {
                username: 'student01',
                password: hashedUserPassword,
                name: 'John Doe',
                role: 'user'
            }
        ]);

        console.log('Database Seeding Completed Successfully! 🌱');
        process.exit(0); // Exit script cleanly
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1); // Exit with error flag
    }
};

seedDatabase();
