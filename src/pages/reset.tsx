import React from 'react';
import {Container} from '@material-ui/core';

import PasswordResetForm from '../components/PasswordResetForm';

const ResetPage = () => {
  return (
    <Container maxWidth="sm">
      <PasswordResetForm />
    </Container>
  );
};

export default ResetPage;
