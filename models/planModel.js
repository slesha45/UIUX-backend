const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    events: [
        {
            eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event",
                required: true
            },
            eventTitle: {
                type: String,
                required: true
            },
            eventPrice: {
                type: Number,
                required: true
            },
            eventImage: {
                type: String,
                required: true
            }
        }
    ]
});

const Plan = mongoose.model("Plan", planSchema);
module.exports = Plan