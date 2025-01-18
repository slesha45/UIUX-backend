const express = require("express");
const { addToPlan, getPlan, removeFromPlan } = require("../controllers/planController");

const { authGuard } = require("../middleware/authGuard");
const router = express.Router();

router.post("/add", authGuard, addToPlan);
router.get("/", authGuard, getPlan);
router.post("/remove", authGuard, removeFromPlan);

module.exports = router;
