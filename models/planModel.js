const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "events", required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", PlanSchema);
