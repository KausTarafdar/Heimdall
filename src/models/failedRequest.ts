import mongoose, { Model, Schema } from 'mongoose';

interface IFailedSchema {
  ip: string,
  reason: string,
  created_at: Date,
  updated_at: Date
}

type FailedRequestModel = Model<IFailedSchema>
const failedRequestSchema = new mongoose.Schema<IFailedSchema, FailedRequestModel>({
  ip: { type: String, required: true, index: true },
  reason: { type: String, required: true }
}, { timestamps: true });

export const FailedRequestModel = mongoose.model('FailedRequest', failedRequestSchema);