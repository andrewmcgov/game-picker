import React from 'react';
import {Container, Typography} from '@material-ui/core';
import GameForm from '../components/GameForm';

export default function Admin() {
  return (
    <Container maxWidth="lg">
      <div style={{flexGrow: 1}}>
        <Typography component="h1" variant="h3">
          Admin
        </Typography>
        <GameForm />
      </div>
    </Container>
  );
}
