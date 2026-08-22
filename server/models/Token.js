const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userPhone: {
      type: String,
      trim: true,
      default: '',
    },
    serviceType: {
      type: String,
      default: 'Main Counter',
    },
    locationId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'serving', 'completed', 'cancelled'],
      default: 'waiting',
      index: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    servedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for quick token lookups per location
tokenSchema.index({ locationId: 1, tokenNumber: 1 });
tokenSchema.index({ locationId: 1, status: 1 });

module.exports = mongoose.model('Token', tokenSchema);
