const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        enum: ['Cod', 'Khalti'],
        default: null,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Booking = mongoose.model('bookings', bookingSchema)
module.exports = Booking;