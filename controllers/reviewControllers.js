const Review = require("../models/reviewModel");

exports.addReview = async (req, res) => {
    const { eventId, rating, comment } = req.body;
    const userId = req.user._id; // Ensure req.user is populated from authentication middleware

    try {
        const review = new Review({ eventId, userId, rating, comment });
        await review.save();
        res.status(201).json({ 
            success: true, 
            message: "Review added successfully", 
            review 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to add review", 
            error 
        });
    }
};

exports.getReviewsByEvent = async (req, res) => {
    const eventId = req.params.eventId;

    try {
        const reviews = await Review.find({ eventId }).populate('userId', 'fullName');
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews", error });
    }
};
