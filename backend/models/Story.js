const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true,
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
