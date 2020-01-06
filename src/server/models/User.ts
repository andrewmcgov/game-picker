import mongoose from 'mongoose';
import {User} from '../types';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: {
    type: String
  },
  resetExpiry: {
    type: String
  }
});

export default mongoose.model<User>('User', userSchema);
