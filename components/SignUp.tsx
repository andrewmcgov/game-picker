import * as React from 'react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {LockOutlined as LockOutlinedIcon} from '@material-ui/icons';
import Error from './Error';
import {CURRENT_USER_QUERY} from '../lib/queries';

export const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION(
    $firstName: String
    $lastName: String
    $email: String
    $password: String
    $repeatPassword: String
    $signupKey: String
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      repeatPassword: $repeatPassword
      signupKey: $signupKey
    ) {
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

function SignUp() {
  const classes = useStyles();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [signupKey, setSignupKey] = React.useState('');

  const [signUp, {loading, error}] = useMutation(SIGN_UP_MUTATION, {
    refetchQueries: [{query: CURRENT_USER_QUERY}]
  });

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signUp({
        variables: {
          firstName,
          lastName,
          email,
          password,
          repeatPassword,
          signupKey
        }
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
        Sign up
      </Typography>
      {error && <Error error={error} />}
      <form
        method="post"
        onSubmit={e => handleFormSubmit(e)}
        className={classes.form}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lname"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="repeat-password"
              label="Repeat Password"
              type="password"
              id="repeat-password"
              autoComplete="current-password"
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Signup Key"
              name="signup-key"
              autoComplete="signup-key"
              value={signupKey}
              onChange={e => setSignupKey(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={loading}
        >
          Sign Up
          {loading && <CircularProgress size={24} />}
        </Button>
      </form>
    </div>
  );
}

export default SignUp;
