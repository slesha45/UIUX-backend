const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    plan:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: false
    },
    package:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "packages",
        required: false
    },
    phone: {
        type: Number,
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
    eventType: {
        type: String,
        required: true
    },
    totalPrice: {
      type: Number,
      required: true  
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'khalti'],
        default: null,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    { timestamps: true }
)

const Booking = mongoose.model('bookings', bookingSchema)
module.exports = Booking;