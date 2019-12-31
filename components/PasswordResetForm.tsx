import React from 'react';
import {useRouter} from 'next/router';
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

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $password: String
    $confirmPassword: String
    $resetToken: String
  ) {
    resetPassword(
      password: $password
      confirmPassword: $confirmPassword
      resetToken: $resetToken
    ) {
      _id
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
  },
  input: {
    margin: theme.spacing(3, 0)
  }
}));

function PasswordResetForm() {
  const classes = useStyles();
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [resetPassword, {loading, error}] = useMutation(
    RESET_PASSWORD_MUTATION
  );

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const user = await resetPassword({
        variables: {
          password,
          confirmPassword,
          resetToken: router.query.resetToken
        },
        refetchQueries: [{query: CURRENT_USER_QUERY}]
      });

      if (user.data.resetPassword) {
        router.push('/account');
      }
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
        Reset Password
      </Typography>
      {error && <Error error={error} />}
      <form
        method="post"
        onSubmit={e => handleFormSubmit(e)}
        className={classes.form}
      >
        <div className={classes.input}>
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
        </div>
        <div className={classes.input}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="repeat-password"
            label="Repeat Password"
            type="password"
            id="repeat-password"
            autoComplete="current-password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={loading}
        >
          Reset Password
          {loading && <CircularProgress size={24} />}
        </Button>
      </form>
    </div>
  );
}

export default PasswordResetForm;
