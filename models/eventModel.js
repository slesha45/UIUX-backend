const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventTitle: {
        type: String,
        required: true
    },
    eventPrice: {
        type: Number,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    eventCategory: {
        type: String,
        required: true
    },
    eventImage: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }, 
    views: {
        type: Number,
        default: 0
    }
});

const Event = mongoose.model("events", eventSchema);
module.exports = Event;                 