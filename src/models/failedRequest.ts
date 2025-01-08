import mongoose from 'mongoose';

const failedRequestSchema = new mongoose.Schema({
  ip: { type: String, required: true, index: true },
  timestamp: { type: Date, required: true },
  reason: { type: String, required: true },
  headers: { type: Object },
}, { timestamps: true });

export const FailedRequestModel = mongoose.model('FailedRequest', failedRequestSchema);