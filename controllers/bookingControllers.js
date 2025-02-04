const Booking = require("../models/bookingModel");
const User = require("../models/userModels");
const Plan = require('../models/planModel');
const Package = require("../models/packageModel");
const Notification = require('../models/notificationModel')

const createBooking = async (req, res) => {
  try {
    const { planId, packageId, date, time, phone, eventType, totalPrice } = req.body;

    // Basic checks
    if (!date || !time || !phone || !eventType || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    // If planId is given, we'll do the logic for plan
    let plan;
    if (planId) {
      plan = await Plan.findById(planId).populate("event");
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }
    }

    // If packageId is given, we do the logic for package
    let myPackage;
    if (packageId) {
      myPackage = await Package.findById(packageId);
      if (!myPackage) {
        return res.status(404).json({
          success: false,
          message: "Package not found",
        });
      }
    }

    // Create booking object
    const newBooking = new Booking({
      user: req.user._id,
      plan: planId || null, // store plan if planId given, else null
      package: packageId || null, // store package if packageId given, else null
      date,
      time,
      phone,
      eventType,
      totalPrice,
      paymentMethod: req.body.paymentMethod || null,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
    });
  }
};


const getAllBookings = async (req, res) => {
    try {
        let bookings;
        if (req.user.isAdmin) {
            bookings = await Booking.find()
                .populate("user", "fullName")
                .populate("plan", "event");
        } else {
            bookings = await Booking.find({ user: req.user._id })
                .populate("user", "fullName")
                .populate("plan", "event");
        }

        return res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
        });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate(
            "plan",
            "event"
        );

        return res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user bookings",
        });
    }
};

const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
        return res.status(400).json({
            success: false,
            message: "Please enter all required fields",
        });
    }

    try {
        const booking = await Booking.findById(bookingId).populate("user");
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        booking.status = status;
        await booking.save();

        const userId = booking.user._id;
        let notificationMessage = "";
        if (status === "confirmed") {
            notificationMessage = `Your booking for ${booking.eventType} on ${booking.date} at ${booking.time} has been CONFIRMED.`;
        } else if (status === "cancelled") {
            notificationMessage = `Your booking for ${booking.eventType} on ${booking.date} at ${booking.time} has been CANCELLED.`;
        }
        if (notificationMessage) {
            await Notification.create({
                user: userId,
                message: notificationMessage
            })
        }

        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating booking status",
        });
    }
};


const updatePayment = async (req, res) => {
    const { bookingId, paymentMethod } = req.body;

    if (!bookingId || !paymentMethod) {
        return res.status(400).json({
            success: false,
            message: "Please enter all required fields",
        });
    }

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        booking.paymentMethod = paymentMethod;
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Payment method updated successfully",
            booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating payment method",
        });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus,
    updatePayment
};