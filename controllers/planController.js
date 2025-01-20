const Plan = require("../models/planModel");

// Add event to plan
exports.addToPlan = async (req, res) => {
  try {
    const { eventId } = req.body;
    const existingPlan = await Plan.findOne({ user: req.user._id, event: eventId });
    if (existingPlan) {
      return res.status(400).json({ success: false, message: "Event already in your plans." });
    }

    // Create a new plan
    const newPlan = new Plan({ user: req.user._id, event: eventId });
    await newPlan.save();

    res.status(201).json({ success: true, message: "Event added to plans.", plan: newPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add event to plans.", error });
  }
};

// Get user's plan
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id }).populate("event");
    res.status(200).json({ success: true, plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ success: false, message: "Failed to fetch plans.", error });
  }
};

// Remove event from plan
exports.removeFromPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found." });
    }

    // Check if the plan belongs to the logged-in user
    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized action." });
    }

    await Plan.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Event removed from plans." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove event from plans.", error });
  }
};
