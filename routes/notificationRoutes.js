const express = require('express');
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { authGuard } = require('../middleware/authGuard');

// Create a notification (for admin or internal use)
router.post('/create', authGuard, createNotification);

// Get all notifications for the logged-in user
router.get('/all', authGuard, getUserNotifications);

// Mark notification as read
router.put('/:id/read', authGuard, markNotificationAsRead);

// Delete notification
router.delete('/:id', authGuard, deleteNotification);

module.exports = router;
