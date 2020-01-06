import mongoose from 'mongoose';
import {Pick} from '../types';

const pickSchema = new mongoose.Schema({
  game: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  pick: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  closed: {
    type: Boolean
  },
  correct: {
    type: Boolean
  }
});

export default mongoose.model<Pick>('Pick', pickSchema);
