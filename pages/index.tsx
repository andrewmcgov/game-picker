import React from 'react';
import {Container, Typography} from '@material-ui/core';

import Feed from '../components/Feed';

function IndexPage() {
  return (
    <Container maxWidth="lg">
      <Typography component="h1" variant="h3">
        Home
      </Typography>

      <Feed />
    </Container>
  );
}
export default IndexPage;
