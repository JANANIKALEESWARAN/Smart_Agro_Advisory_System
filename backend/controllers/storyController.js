const asyncHandler = require('express-async-handler');
const Story = require('../models/Story');

// @desc    Get all approved stories
// @route   GET /api/stories
// @access  Public
const getStories = asyncHandler(async (req, res) => {
    const stories = await Story.find({ isApproved: true }).populate('user', 'name').populate('product', 'name image');
    res.json(stories);
});

// @desc    Create a story
// @route   POST /api/stories
// @access  Private
const createStory = asyncHandler(async (req, res) => {
    const { title, content, image, productId } = req.body;

    const story = new Story({
        title,
        content,
        image,
        user: req.user._id,
        product: productId,
    });

    const createdStory = await story.save();
    res.status(201).json(createdStory);
});

// @desc    Get all stories for admin
// @route   GET /api/stories/admin
// @access  Private/Admin
const getAdminStories = asyncHandler(async (req, res) => {
    const stories = await Story.find({}).populate('user', 'name').populate('product', 'name');
    res.json(stories);
});

// @desc    Approve a story
// @route   PUT /api/stories/:id/approve
// @access  Private/Admin
const approveStory = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id);

    if (story) {
        story.isApproved = true;
        const updatedStory = await story.save();
        res.json(updatedStory);
    } else {
        res.status(404);
        throw new Error('Story not found');
    }
});

// @desc    Delete a story
// @route   DELETE /api/stories/:id
// @access  Private/Admin
const deleteStory = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id);

    if (story) {
        await story.deleteOne();
        res.json({ message: 'Story removed' });
    } else {
        res.status(404);
        throw new Error('Story not found');
    }
});

module.exports = {
    getStories,
    createStory,
    getAdminStories,
    approveStory,
    deleteStory,
};
