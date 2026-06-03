require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Event, Registration } = require('./models/schema');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        await Promise.all([
            User.deleteMany({}),
            Event.deleteMany({}),
            Registration.deleteMany({})
        ]);
        console.log('Cleared existing user, event, and registration data.');

        const hashedAdminPassword = await bcrypt.hash('inspirante2026', 10);
        const hashedStudentPassword = await bcrypt.hash('student123', 10);

       
        const users = [
            { username: 'admin', password: hashedAdminPassword, name: 'Admin', role: 'admin' }
        ];

        
        const studentList = [
            ['Asha Rao', 'asha.rao'],
            ['Ravi Shetty', 'ravi.shetty'],
            ['Meera Nair', 'meera.nair'],
            ['Kiran Bhat', 'kiran.bhat'],
            ['Divya Kamath', 'divya.kamath'],
            ['Suresh Pai', 'suresh.pai'],
            ['Ananya Hegde', 'ananya.hegde'],
            ['Rohan Shenoy', 'rohan.shenoy'],
            ['Nisha Prabhu', 'nisha.prabhu'],
            ['Tejas Mallya', 'tejas.mallya'],
            ['Priya Bangera', 'priya.bangera']
        ];

        for (const [name, username] of studentList) {
            users.push({ username, password: hashedStudentPassword, name, role: 'user' });
        }

        await User.insertMany(users);

        
        const events = [
            { title: 'Tech Symposium 2026', date: '2026-07-10', venue: 'Main Auditorium', capacity: 120 },
            { title: 'Hackathon', date: '2026-07-15', venue: 'Lab Block C', capacity: 40 },
            { title: 'Cultural Fest', date: '2026-07-20', venue: 'Open Amphitheatre', capacity: 300 },
            { title: 'Workshop: React Basics', date: '2026-07-22', venue: 'Seminar Hall 2', capacity: 30 },
            { title: 'Placement Prep Talk', date: '2026-07-25', venue: 'Main Auditorium', capacity: 200 }
        ];

        await Event.insertMany(events.map(e => ({ ...e, registrationCount: 0 })));

        console.log('Database Seeding Completed Successfully! 🌱');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
