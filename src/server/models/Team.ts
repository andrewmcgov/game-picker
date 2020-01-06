import mongoose from 'mongoose';
import {Team} from '../types';

const teamSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    required: true
  },
  league: {
    type: String,
    required: true
  },
  abr: {
    type: String,
    required: true
  }
});

export default mongoose.model<Team>('Team', teamSchema);
