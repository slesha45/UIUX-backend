const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingControllers");
const {authGuard} = require("../middleware/authGuard");

router.post("/create", authGuard, bookingController.createBooking);
router.get("/all-bookings", authGuard, bookingController.getAllBookings);
router.get('/mybookings', authGuard, bookingController.getUserBookings);
router.put('/update-status', authGuard, bookingController.updateBookingStatus);
router.put('/update-payment', authGuard, bookingController.updatePayment);

module.exports = router;