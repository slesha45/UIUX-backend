const express = require("express");
const { addToPlan, removeFromPlan, getPlans } = require("../controllers/planController");

const { authGuard } = require("../middleware/authGuard");
const router = express.Router();

router.post("/add", authGuard, addToPlan);
router.get("/all", authGuard, getPlans);
router.delete("/remove/:id", authGuard, removeFromPlan);

module.exports = router;
