const Booking = require("../models/bookingModel");
const User = require("../models/userModels");
const Event = require('../models/eventModel');

const createBooking = async (req, res) => {
    const { userId, eventId, date, time } = req.body;

    if (!userId || !eventId || !date || !time) {
        return res.status(400).json({
            "success": false,
            "message": "Please enter all fields"
        })
    }

    try {
        const newBooking = new Booking({
            user: userId,
            event: eventId,
            date: date,
            time: time
        });
        await newBooking.save();

        res.status(201).json({
            "success": true,
            "message": "Booking created successfully",
            booking: newBooking
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Error creating booking"
        })
    }
}

const getAllBookings = async (req, res) => {
    try {
        let bookings;
        if (req.user.isAdmin) {
            bookings = await Booking.find().populate('user', 'fullName').populate('event', 'eventTitle');
        } else {
            bookings = await Booking.find({ user: req.user._id }).populate('user', 'fullName').populate('event', 'eventTitle');
        }
        return res.status(200).json({
            "success": true,
            data: bookings
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Error fetching bookings"
        })
    }
}

const getUserBookings = async (req, res) => {
    try {
        const userBookings = await Booking.find({ user: req.user._id }).populate('event', 'eventTitle');
        return res.status(200).json({
            "success": true,
            data: userBookings
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Error fetching user bookings"
        })
    }
}

const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
        return res.status(400).json({
            "success": false,   
            "message": "Please enter all fields"
        })
    }

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                "success": false,
                "message": "Booking not found"
            })
        }
        booking.status = status;
        await booking.save();

        return res.status(200).json({
            "success": true,
            "message": "Booking status updated successfully",
            booking
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Error updating booking status"
        })
    }
}

const updatePayment = async(res,req)=>{
    const {bookingId,paymentStatus} = req.body;

    if(!bookingId || !paymentStatus){
        return res.status(400).json({
            "success": false,   
            "message": "Please enter all fields"
        })
    }
    try{
        const booking = await Booking.findById(bookingId);
        if(!booking){
            return res.status(404).json({
                "success": false,
                "message": "Booking not found"
            })
        }
        booking.paymentMethod = paymentStatus;
        await booking.save();   

        return res.status(200).json({
            "success": true,
            "message": "Payment status updated successfully",
            booking
        })
    }catch(error){
        res.status(500).json({
            "success": false,
            "message": "Error updating payment status"
        })
    }
}

module.exports = {
    createBooking,
    getAllBookings,
    getUserBookings,
    updateBookingStatus,
    updatePayment
};