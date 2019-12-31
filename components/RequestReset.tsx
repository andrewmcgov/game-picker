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
import {
  LockOutlined as LockOutlinedIcon,
  Check as CheckIcon
} from '@material-ui/icons';

import Error from './Error';

const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation REQUEST_PASSWORD_RESET_MUTATION($email: String) {
    requestReset(email: $email)
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
  check: {
    margin: '.5rem',
    backgroundColor: theme.palette.success.main
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

interface Props {
  footerMarkup: JSX.Element;
}

function PasswordResetForm({footerMarkup}: Props) {
  const classes = useStyles();
  const [email, setEmail] = React.useState('');
  const [resetPassword, {data, loading, error}] = useMutation(
    REQUEST_PASSWORD_RESET_MUTATION
  );

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await resetPassword({
        variables: {
          email
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (data && data.requestReset) {
    return (
      <div className={classes.container}>
        <Avatar className={classes.check}>
          <CheckIcon />
        </Avatar>
        <Typography component="h5" variant="h5">
          Reset password email sent.
        </Typography>
      </div>
    );
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={loading}
        >
          Request password reset
          {loading && <CircularProgress size={24} />}
        </Button>
      </form>
      {footerMarkup}
    </div>
  );
}

export default PasswordResetForm;
