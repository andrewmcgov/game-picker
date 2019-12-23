import React from 'react';

export interface UserContext {
  firstName?: string;
  lastName?: string;
  _id?: string;
}

export const UserContext = React.createContext<UserContext | null>({});
