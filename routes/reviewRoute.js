const express = require("express");
const router = express.Router();
const { authGuard } = require("../middleware/authGuard");
const { addReview, getReviewsByEvent } = require("../controllers/reviewControllers");
 
router.post("/add", authGuard, addReview);
router.get("/event/:eventId", getReviewsByEvent);
 
module.exports = router;