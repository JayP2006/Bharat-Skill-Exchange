const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guru: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "REQUESTED",
        "ACCEPTED",
        "SCHEDULED",
        "COMPLETED",
        "REVIEWED",
        "CANCELLED",
      ],
      default: "REQUESTED",
    },
    autoAccepted: {
  type: Boolean,
  default: false,
},

priorityScore: {
  type: Number,
  default: 0,
},

    scheduledAt: Date,
    durationInMinutes: Number,

    cancelReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
