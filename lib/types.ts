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

export interface CurrentUserQueryResponse {
  currentUser?: User;
}

export interface TeamsQueryResponse {
  teams?: Team[];
}
