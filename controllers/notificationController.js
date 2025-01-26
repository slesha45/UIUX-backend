const Notification = require('../models/notificationModel');

// Create a notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newNotification = new Notification({
      user: userId,
      message
    });
    await newNotification.save();

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: newNotification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating notification",
      error
    });
  }
};

// Get all notifications for the logged-in user
exports.getUserNotifications = async (req, res) => {
  try {
    // req.user._id from authGuard
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error
    });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params; // notification ID
    const notification = await Notification.findOne({
      _id: id,
      user: req.user._id
    });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating notification",
      error
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error
    });
  }
};
