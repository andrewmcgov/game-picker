import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {CircularProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import gql from 'graphql-tag';

import GameCard from './GameCard';
import {GamesQueryResponse} from '../lib/types';

const GAMES_QUERY = gql`
  query GAMES_QUERY {
    games {
      _id
      home {
        _id
        name
        abr
      }
      away {
        _id
        name
        abr
      }
      startTime
      week
    }
  }
`;

const useStyles = makeStyles(theme => ({
  cardContainer: {
    margin: theme.spacing(3, 0),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridColumnGap: theme.spacing(3),
    gridRowGap: theme.spacing(3),
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr'
    }
  }
}));

export default function Feed() {
  const classes = useStyles();
  const {data, loading, error} = useQuery<GamesQueryResponse>(GAMES_QUERY);

  const gamesMarkup = (
    <div className={classes.cardContainer}>
      {data &&
        data.games &&
        data.games.map(game => <GameCard key={game._id} game={game} />)}
    </div>
  );

  return (
    <div>
      {loading && <CircularProgress />}
      {gamesMarkup}
    </div>
  );
}
