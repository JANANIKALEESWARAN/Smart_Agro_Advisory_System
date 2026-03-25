const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const listCollections = async () => {
    try {
        await connectDB();
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Connected to DB:', mongoose.connection.name);
        console.log('Collections existing in DB:');
        collections.forEach(c => console.log(' - ' + c.name));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listCollections();
