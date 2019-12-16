export interface User extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  _id?: string;
}

export interface CurrentUserQueryResponse {
  currentUser?: User;
}
