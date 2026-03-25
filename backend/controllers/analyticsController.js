const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
    try {
        console.log('Analytics endpoint called');

        // Get order status distribution
        const confirmedOrders = await Order.countDocuments({ isConfirmed: true, isDelivered: true });
        const pendingOrders = await Order.countDocuments({ isConfirmed: false });
        const processingOrders = await Order.countDocuments({ isConfirmed: true, isDelivered: false });

        console.log('Order counts:', { confirmedOrders, pendingOrders, processingOrders });

        const orderStatusData = [
            { name: 'Delivered', value: confirmedOrders },
            { name: 'Pending', value: pendingOrders },
            { name: 'Processing', value: processingOrders },
        ];

        // Get monthly sales data (last 7 months)
        const monthlySalesData = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalPrice' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 7 }
        ]);

        console.log('Monthly sales data:', monthlySalesData);

        // Format monthly sales data
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlySales = monthlySalesData.map(item => ({
            name: monthNames[item._id.month - 1],
            revenue: Math.round(item.revenue),
            orders: item.orders
        }));

        // Get user growth data (last 6 months)
        const userGrowthData = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    users: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 6 }
        ]);

        console.log('User growth data:', userGrowthData);

        // Calculate cumulative user growth
        let cumulativeUsers = 0;
        const userGrowth = userGrowthData.map(item => {
            cumulativeUsers += item.users;
            return {
                name: monthNames[item._id.month - 1],
                users: cumulativeUsers
            };
        });

        // Get total statistics
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const lowStockProducts = await Product.countDocuments({
            $expr: { $lte: ['$countInStock', '$minThreshold'] }
        });

        console.log('Stats:', { totalProducts, totalOrders, totalUsers, lowStockProducts });

        const responseData = {
            monthlySales,
            orderStatusData,
            userGrowth,
            stats: {
                totalRevenue: totalRevenue[0]?.total || 0,
                totalProducts,
                totalOrders,
                totalUsers,
                lowStockProducts
            }
        };

        console.log('Sending analytics response');
        res.json(responseData);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    getAnalytics
};
