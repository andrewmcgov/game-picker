export interface User extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  _id?: string;
}

export interface Team {
  _id: string;
  name: string;
  nickname: string;
  city: string;
  abr: string;
  league: string;
}

export interface Game {
  _id: string;
  home: Team;
  away: Team;
  startTime: string;
  hasStarted: boolean;
  week: string;
  picks: Pick[];
}

export interface Pick {
  _id: string;
  game: Game;
  pick: Team;
  user: User;
  closed: boolean;
  correct?: boolean;
}

export interface CurrentUserQueryResponse {
  currentUser?: User;
}

export interface TeamsQueryResponse {
  teams?: Team[];
}

export interface GamesQueryResponse {
  games?: Game[];
}
