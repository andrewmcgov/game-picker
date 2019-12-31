import React from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import format from 'date-fns/format';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

import {UserContext} from '../lib/user-context';
import Error from './Error';
import {Game} from '../lib/types';

interface Props {
  game: Game;
}

const PICK_GAME_MUTATION = gql`
  mutation PICK_GAME_MUTATION($game: ID, $pick: ID) {
    makePick(game: $game, pick: $pick) {
      _id
      pick {
        _id
        name
      }
    }
  }
`;

const useStyles = makeStyles(theme => ({
  teamNames: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 3fr',
    gridColumnGap: theme.spacing(2),
    textAlign: 'center',
    padding: theme.spacing(2, 0),
    '@media (max-width: 600px)': {
      display: 'block'
    }
  },
  radios: {
    textAlign: 'center',
    padding: theme.spacing(2, 0, 0)
  },
  startTime: {
    textAlign: 'center'
  },
  progress: {
    textAlign: 'center'
  }
}));

export default function GameCard({game}: Props) {
  const classes = useStyles();
  const user = React.useContext(UserContext);
  const [pick, setPick] = React.useState<string>(getUserPickValue());
  const {home, away} = game;

  const [makePick, {data, loading, error}] = useMutation(PICK_GAME_MUTATION);

  function getUserPickValue() {
    if (user) {
      const pick = game.picks.find(pick => pick.user._id === user._id);

      return pick ? pick.pick._id : '';
    }
    return '';
  }

  async function handlePickMutation(pickedTeamId: string) {
    try {
      const result = await makePick({
        variables: {
          game: game._id,
          pick: pickedTeamId
        }
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  function handlePickChange(e: React.ChangeEvent<HTMLInputElement>) {
    const pickedTeamId = e.target.value;
    setPick(pickedTeamId);
    handlePickMutation(pickedTeamId);
  }

  return (
    <Card>
      <CardContent>
        <div className={classes.teamNames}>
          <Typography component="h4" variant="h5">
            {away.name}
          </Typography>
          <Typography component="h4" variant="h5">
            @
          </Typography>
          <Typography component="h4" variant="h5">
            {home.name}
          </Typography>
        </div>
        <div className={classes.startTime}>
          <Typography variant="subtitle1">
            {format(new Date(game.startTime), 'eeee LLL do p')}
          </Typography>
        </div>
        <div className={classes.radios}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="pick"
              name="pick"
              value={pick}
              onChange={handlePickChange}
              row
            >
              <FormControlLabel
                value={away._id}
                control={<Radio color="primary" />}
                label={away.abr}
                labelPlacement="top"
                disabled={loading}
              />
              <FormControlLabel
                value={home._id}
                control={<Radio color="primary" />}
                label={home.abr}
                labelPlacement="top"
                disabled={loading}
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className={classes.progress}>
          {loading && <CircularProgress size={24} />}
          {data && data.makePick && !loading && !error && (
            <Typography variant="subtitle1">Pick saved!</Typography>
          )}
          {error && <Error error={error} />}
        </div>
      </CardContent>
    </Card>
  );
}
