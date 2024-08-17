import mongoose, { Schema, Document } from 'mongoose';

interface IOtpVerification extends Document {
  userId: mongoose.Types.ObjectId;
  otp: string;
  attempts: number;
  verified: boolean;
}

const OtpVerificationSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
});

export default mongoose.model<IOtpVerification>('OtpVerification', OtpVerificationSchema);
