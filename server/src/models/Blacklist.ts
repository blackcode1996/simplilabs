import mongoose, { Schema, Document } from 'mongoose';

interface IBlacklist extends Document {
  userId: mongoose.Types.ObjectId;
  blacklistDate: Date;
  durationDays: number;
}

const BlacklistSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  blacklistDate: { type: Date, required: true, default: Date.now },
  durationDays: { type: Number, required: true, default: 1 },
});

export default mongoose.model<IBlacklist>('Blacklist', BlacklistSchema);
