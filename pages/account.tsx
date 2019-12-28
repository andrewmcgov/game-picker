import React from 'react';
import {Container, Typography} from '@material-ui/core';
import {UserContext} from '../lib/user-context';
import SignOut from '../components/SignOut';

export default function AccountPage() {
  const user = React.useContext(UserContext);

  if (!user) return null;

  return (
    <Container maxWidth="lg">
      <Typography component="h1" variant="h3">
        Account
      </Typography>

      <p>
        You are currently logged in as: <strong>{user.firstName}</strong>
      </p>

      <SignOut />
    </Container>
  );
}
