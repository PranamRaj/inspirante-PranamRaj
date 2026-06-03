require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models/schema');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        await User.deleteMany({});
        console.log('Cleared existing user data.');

        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const hashedUserPassword = await bcrypt.hash('user123', 10);
        const hashedUserPassword1 = await bcrypt.hash('user123', 10);


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
                name: 'student01',
                role: 'user'
            },
            {
                username: 'student02',
                password: hashedUserPassword1,
                name: 'student02',
                role: 'user'
            }
        ]);

        console.log('Database Seeding Completed Successfully! 🌱');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
