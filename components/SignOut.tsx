import * as React from 'react';
import gql from 'graphql-tag';
import {Button} from '@material-ui/core';
import {useMutation} from '@apollo/react-hooks';

import {CURRENT_USER_QUERY} from '../lib/queries';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signOut
  }
`;

function SignOut() {
  const [signOut, {loading}] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{query: CURRENT_USER_QUERY}]
  });

  return (
    <Button
      onClick={() => signOut()}
      disabled={loading}
      variant="contained"
      color="primary"
    >
      Sign out!
    </Button>
  );
}

export default SignOut;
