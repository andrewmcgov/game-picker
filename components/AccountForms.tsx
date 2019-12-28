import React from 'react';
import {Container, Grid, Link} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import SignIn from './SignIn';
import SignUp from './SignUp';

const useStyles = makeStyles(theme => ({
  links: {
    margin: theme.spacing(1, 0)
  }
}));

function AccountForms() {
  const classes = useStyles();
  const [signUp, setSignUp] = React.useState(false);

  function handleFormChange(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    setSignUp(signUp => !signUp);
  }

  if (signUp) {
    return (
      <Container maxWidth="sm">
        <SignUp />
        <div className={classes.links}>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                  handleFormChange(e)
                }
              >
                Already have an account? Sign in.
              </Link>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <SignIn />
      <div className={classes.links}>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link
              href="#"
              variant="body2"
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                handleFormChange(e)
              }
            >
              Don't have an account? Sign up.
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export default AccountForms;
