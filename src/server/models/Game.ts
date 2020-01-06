import mongoose from 'mongoose';
import {Game} from '../types';

const gameSchema = new mongoose.Schema({
  home: {type: mongoose.Types.ObjectId, required: true},
  away: {type: mongoose.Types.ObjectId, required: true},
  startTime: {
    type: String,
    required: true
  },
  winner: mongoose.Types.ObjectId,
  league: {type: String, required: true},
  season: {type: String, required: true},
  week: {type: String, required: true}
});

export default mongoose.model<Game>('Game', gameSchema);
