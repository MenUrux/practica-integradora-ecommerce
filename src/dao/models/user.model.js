import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  age: { type: Number, required: false },
  role: { type: String, default: 'user', required: false },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
  last_connection: { type: Date },
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true }
    }
  ]
}, { timestamps: true });

export default mongoose.model('User', userSchema);