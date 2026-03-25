const express = require('express');
const router = express.Router();
const {
    getStories,
    createStory,
    getAdminStories,
    approveStory,
    deleteStory,
} = require('../controllers/storyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getStories)
    .post(protect, createStory);

router.route('/admin')
    .get(protect, admin, getAdminStories);

router.route('/:id')
    .delete(protect, admin, deleteStory);

router.route('/:id/approve')
    .put(protect, admin, approveStory);

module.exports = router;
