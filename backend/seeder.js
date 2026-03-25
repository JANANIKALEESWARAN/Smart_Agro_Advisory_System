const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();

        let adminUser;
        const existingAdmin = await User.findOne({ isAdmin: true });

        if (existingAdmin) {
            adminUser = existingAdmin._id;
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            const createdUsers = await User.insertMany([
                {
                    name: 'Admin User',
                    email: 'admin@gmail.com',
                    password: hashedPassword,
                    isAdmin: true,
                },
                {
                    name: 'John Farmer',
                    email: 'farmer@example.com',
                    password: await bcrypt.hash('123456', salt),
                    isAdmin: false,
                },
            ]);
            adminUser = createdUsers[0]._id;
        }

        const sampleProducts = [
            {
                name: 'Mancozeb 75% WP Fungicide',
                image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop',
                description: 'Broad-spectrum fungicide for control of early and late blight in tomatoes and potatoes.',
                brand: 'CropCare',
                category: 'Pesticide',
                price: 12.50,
                countInStock: 40,
                rating: 4.8,
                numReviews: 20,
                user: adminUser,
            },
            {
                name: 'Copper Oxychloride Fungicide',
                image: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?auto=format&fit=crop&w=800&q=60',
                description: 'Effective against a wide range of fungal and bacterial diseases like early blight.',
                brand: 'AgriBlue',
                category: 'Pesticide',
                price: 14.20,
                countInStock: 25,
                rating: 4.5,
                numReviews: 12,
                user: adminUser,
            },
            {
                name: 'Metalaxyl 35% SD Fungicide',
                image: 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&w=800&q=60',
                description: 'Systemic fungicide used specifically for controlling late blight.',
                brand: 'TechAgro',
                category: 'Pesticide',
                price: 18.75,
                countInStock: 15,
                rating: 4.6,
                numReviews: 9,
                user: adminUser,
            },
            {
                name: 'Organic Nitrogen Fertilizer',
                image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2000&auto=format&fit=crop',
                description: 'High quality nitrogen fertilizer for all crops. Promotes rapid growth.',
                brand: 'GreenGrow',
                category: 'Fertilizer',
                price: 29.99,
                countInStock: 50,
                rating: 4.5,
                numReviews: 12,
                user: adminUser,
            },
            {
                name: 'DAP Fertilizer',
                image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop',
                description: 'Di-ammonium Phosphate fertilizer for root development.',
                brand: 'FarmKing',
                category: 'Fertilizer',
                price: 35.50,
                countInStock: 30,
                rating: 4.2,
                numReviews: 8,
                user: adminUser,
            },
            {
                name: 'Urea Fertilizer 46%',
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fertilizer_NPK_008.JPG?width=800',
                description: 'High nitrogen content urea fertilizer for leafy growth.',
                brand: 'VigorGrow',
                category: 'Fertilizer',
                price: 18.00,
                countInStock: 100,
                rating: 4.6,
                numReviews: 22,
                user: adminUser,
            },
            {
                name: 'Neem Oil Pesticide',
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Neem_oil.jpg?width=800',
                description: 'Organic pesticide effective against aphids, mites, and whiteflies.',
                brand: 'OrganicShield',
                category: 'Pesticide',
                price: 15.00,
                countInStock: 20,
                rating: 4.7,
                numReviews: 15,
                user: adminUser,
            },
            {
                name: 'Chlorpyrifos 20% EC',
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Insecticide_Spray.jpg?width=800',
                description: 'Broad spectrum insecticide for termites and borers.',
                brand: 'ChemPest',
                category: 'Pesticide',
                price: 22.00,
                countInStock: 15,
                rating: 3.9,
                numReviews: 5,
                user: adminUser,
            },
            {
                name: 'Hybrid Tomato Seeds',
                image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=2000&auto=format&fit=crop',
                description: 'High-yield hybrid tomato seeds, disease resistant.',
                brand: 'AgriSeeds',
                category: 'Seeds',
                price: 5.00,
                countInStock: 100,
                rating: 4.8,
                numReviews: 25,
                user: adminUser,
            },
            {
                name: 'Paddy Seeds (Basmati)',
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2000&auto=format&fit=crop',
                description: 'Premium quality Basmati rice seeds.',
                brand: 'GoldenHarvest',
                category: 'Seeds',
                price: 12.00,
                countInStock: 80,
                rating: 4.6,
                numReviews: 10,
                user: adminUser,
            },
            {
                name: 'Knapsack Sprayer 16L',
                image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Knapsack_sprayer.jpg?width=800',
                description: 'Manual knapsack sprayer with 16L capacity for pesticides.',
                brand: 'AgriTool',
                category: 'Equipment',
                price: 45.00,
                countInStock: 10,
                rating: 4.4,
                numReviews: 6,
                user: adminUser,
            },
            {
                name: 'Gardening Gloves',
                image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=2000&auto=format&fit=crop',
                description: 'Durable rubber gloves for farm work.',
                brand: 'HandSafe',
                category: 'Equipment',
                price: 8.00,
                countInStock: 50,
                rating: 4.1,
                numReviews: 4,
                user: adminUser,
            },
        ];

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
