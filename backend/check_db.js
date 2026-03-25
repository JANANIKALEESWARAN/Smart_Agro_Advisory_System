const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const checkData = async () => {
    try {
        const count = await Product.countDocuments();
        console.log(`Total Products in DB: ${count}`);
        if (count > 0) {
            const products = await Product.find({});
            console.log('Sample Product:', JSON.stringify(products[0], null, 2));
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
