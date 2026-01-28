const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    guru: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    topics: [String],

    requirements: String,

    hourlyRate: {
      type: Number,
      default: 0,
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
      required: false,
    },

    media: [String],

    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },

    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

skillSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Skill',skillSchema);
