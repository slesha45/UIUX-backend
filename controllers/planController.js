const Plan = require("../models/planModel");
const Event = require("../models/eventModel");

// Add event to plan
exports.addToPlan = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming userId comes from authenticated user
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    let userPlan = await Plan.findOne({ userId });

    if (!userPlan) {
      userPlan = new Plan({ userId, events: [] });
    }

    const alreadyAdded = userPlan.events.some((e) => e.eventId.equals(eventId));
    if (alreadyAdded) {
      return res.status(400).json({ success: false, message: "Event already in your plan" });
    }

    userPlan.events.push({
      eventId: event._id,
      eventTitle: event.eventTitle,
      eventPrice: event.eventPrice,
      eventImage: event.eventImage,
    });

    await userPlan.save();
    res.status(200).json({ success: true, message: "Event added to plan", plan: userPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding to plan", error });
  }
};

// Get user's plan
exports.getPlan = async (req, res) => {
  try {
    const { userId } = req.user;

    const userPlan = await Plan.findOne({ userId });
    if (!userPlan) {
      return res.status(404).json({ success: false, message: "No plan found" });
    }

    res.status(200).json({ success: true, plan: userPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching plan", error });
  }
};

// Remove event from plan
exports.removeFromPlan = async (req, res) => {
  try {
    const { userId } = req.user;
    const { eventId } = req.body;

    const userPlan = await Plan.findOne({ userId });
    if (!userPlan) {
      return res.status(404).json({ success: false, message: "No plan found" });
    }

    userPlan.events = userPlan.events.filter((e) => !e.eventId.equals(eventId));
    await userPlan.save();

    res.status(200).json({ success: true, message: "Event removed from plan", plan: userPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing from plan", error });
  }
};
