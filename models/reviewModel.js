const monogoose = require("mongoose");

const reviewSchema = new monogoose.Schema({
    eventId: {
        type: monogoose.Schema.Types.ObjectId,
        ref: "events",
        required: true
    },
    userId: {
        type: monogoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Review = monogoose.model('reviews', reviewSchema);
module.exports = Review