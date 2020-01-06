import React from 'react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {
  Avatar,
  Button,
  CircularProgress,
  TextField,
  Typography
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {LockOutlined as LockOutlinedIcon} from '@material-ui/icons';

import {CURRENT_USER_QUERY} from '../lib/queries';
import Error from './Error';

const SIGN_IN_MUTATION = gql`
  mutation SIGN_IN_MUTATION($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      firstName
      lastName
      email
    }
  }
`;

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: '.5rem',
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function SignIn() {
  const classes = useStyles({});
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [signIn, {loading, error}] = useMutation(SIGN_IN_MUTATION);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signIn({
        variables: {
          email,
          password
        },
        refetchQueries: [{query: CURRENT_USER_QUERY}]
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={classes.container}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      {error && <Error error={error} />}
      <form
        method="post"
        onSubmit={e => handleFormSubmit(e)}
        className={classes.form}
      >
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={loading}
        >
          Sign In
          {loading && <CircularProgress size={24} />}
        </Button>
      </form>
    </div>
  );
}

export default SignIn;
