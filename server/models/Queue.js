const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    locationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    currentServingToken: {
      type: Number,
      default: 0,
    },
    nextTokenNumber: {
      type: Number,
      default: 1,
    },
    averageServiceTime: {
      type: Number,
      default: 2, // minutes per customer
      min: 1,
    },
    activeCounters: {
      type: Number,
      default: 2,
      min: 1,
    },
    loadFactor: {
      type: Number,
      default: 1.0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Queue', queueSchema);
