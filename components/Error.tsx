import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

interface Props {
  error: {
    message: string;
    networkError?: any;
  };
}

const useStyles = makeStyles(theme => ({
  errorBanner: {
    padding: theme.spacing(0.5, 2),
    margin: theme.spacing(1, 0),
    backgroundColor: theme.palette.error.light,
    borderLeft: `3px solid ${theme.palette.error.dark}`,
    width: '100%'
  }
}));

// Shout out to @wesbos for this Error component 🙌🏻
function Error({error}: Props) {
  const classes = useStyles();

  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map(
      (error: {message: string}, i: number) => (
        <div key={i} className={classes.errorBanner}>
          <p>Error: {error.message.replace('GraphQL error: ', '')}</p>
        </div>
      )
    );
  }
  return (
    <div className={classes.errorBanner}>
      <p>Error: {error.message.replace('GraphQL error: ', '')}</p>
    </div>
  );
}

export default Error;
