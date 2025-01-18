const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistControllers");
const { authGuard } = require("../middleware/authGuard");

router.post("/add",authGuard, wishlistController.addToWishlist);
router.get("/all",authGuard,  wishlistController.getUserWishlist);
router.delete("/remove/:eventId",authGuard,  wishlistController.removeFromWishlist);

module.exports = router