import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);
