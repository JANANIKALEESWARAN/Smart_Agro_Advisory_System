const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        
        if (req.body.id) {
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid by Admin (for COD)
// @route   PUT /api/orders/:id/admin-pay
// @access  Private/Admin
const updateOrderToPaidAdmin = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        
        // Also update the payment result to COMPLETED if it was pending
        if (order.paymentResult && order.paymentResult.status === 'PENDING_VERIFICATION') {
            order.paymentResult.status = 'COMPLETED';
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Submit UTR for UPI payment
// @route   PUT /api/orders/:id/submit-utr
// @access  Private
const submitUPIUTR = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.paymentResult = {
            id: req.body.utr,
            status: 'PENDING_VERIFICATION',
            update_time: Date.now().toString(),
            email_address: req.user.email,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Update order to confirmed
// @route   PUT /api/orders/:id/confirm
// @access  Private/Admin
const updateOrderToConfirmed = asyncHandler(async (req, res) => {
    console.log(`Confirming order: ${req.params.id}`);
    const order = await Order.findById(req.params.id);

    if (order) {
        // Check stock levels first
        for (const item of order.orderItems) {
            console.log(`Checking item: ${item.product}`);
            const product = await Product.findById(item.product);
            if (product) {
                console.log(`Found product: ${product.name}, Stock: ${product.countInStock}`);
                if (product.countInStock < 2) {
                    console.log(`Stock low for ${product.name}, throwing error`);
                    res.status(400);
                    throw new Error(`Cannot confirm. Product '${product.name}' has low stock (${product.countInStock}). Please restore stock.`);
                }
            } else {
                console.log(`Product not found: ${item.product}`);
            }
        }

        // If all checks pass, reduce stock
        console.log('Stock check passed. Reducing stock...');
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock = product.countInStock - item.qty;
                await product.save();
            }
        }

        order.isConfirmed = true;
        order.confirmedAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to shipped
// @route   PUT /api/orders/:id/shipped
// @access  Private/Admin
const updateOrderToShipped = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isShipped = true;
        order.shippedAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to out for delivery
// @route   PUT /api/orders/:id/out-for-delivery
// @access  Private/Admin
const updateOrderToOutForDelivery = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isOutForDelivery = true;
        order.outForDeliveryAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToPaidAdmin,
    submitUPIUTR,
    updateOrderToConfirmed,
    updateOrderToShipped,
    updateOrderToOutForDelivery,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
};
