const mongoose = require("mongoose");
const { events } = require("./bookingModel");

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    events: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Wishlist = mongoose.model("wishlist", wishlistSchema);
module.exports = Wishlist