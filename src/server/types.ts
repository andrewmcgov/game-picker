import {Document, Types} from 'mongoose';

export interface User extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface CreateUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  repeatPassword: string;
  signupKey: string;
}

export interface Team extends Document {
  city: string;
  name: string;
  nickname: string;
  league: string;
  abr: string;
}

export interface Game extends Document {
  home: Team;
  away: Team;
  startTime: string;
  winner: Team | null;
  league: string;
  season: string;
  week: string;
}

export interface Pick extends Document {
  userId: string;
  gameId: string;
  pick: string;
}
