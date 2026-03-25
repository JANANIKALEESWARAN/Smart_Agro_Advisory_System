const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/').get(protect, getUsers);

module.exports = router;
