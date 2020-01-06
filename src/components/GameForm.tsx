import React from 'react';
import gql from 'graphql-tag';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  SnackbarContent,
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {makeStyles} from '@material-ui/core/styles';

import {TEAMS_QUERY} from '../lib/queries';
import {TeamsQueryResponse} from '../lib/types';
import Error from './Error';

const CREAT_GAME_MUTATION = gql`
  mutation CREAT_GAME_MUTATION(
    $home: ID
    $away: ID
    $startTime: String
    $week: String
  ) {
    createGame(
      home: $home
      away: $away
      startTime: $startTime
      league: "NFL"
      season: "2019"
      week: $week
    ) {
      home {
        name
      }
      away {
        name
      }
      startTime
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  inputSpacing: {
    margin: theme.spacing(0, 3)
  },
  container: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: '.5rem',
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridColumnGap: theme.spacing(3),
    padding: theme.spacing(3, 0)
  },
  snackBar: {
    background: theme.palette.success.main
  },
  icon: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
}));

export default function GameForm() {
  const classes = useStyles({});
  const [home, setHome] = React.useState();
  const [away, setAway] = React.useState();
  const [week, setWeek] = React.useState();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );

  const {data: teamsData, loading: teamsLoading, error: teamsError} = useQuery<
    TeamsQueryResponse
  >(TEAMS_QUERY);

  const [createGame, {data, loading, error}] = useMutation(CREAT_GAME_MUTATION);

  async function handleCreateGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const result = await createGame({
        variables: {
          home,
          away,
          startTime: selectedDate,
          week
        }
      });
      if (result.data && result.data.createGame) {
        resetForm();
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function resetForm() {
    setHome('');
    setAway('');
    setWeek('');
  }

  return (
    <Paper>
      <div className={classes.container}>
        <Typography component="h2" variant="h5">
          Create game
        </Typography>
        {error && <Error error={error} />}
        <form
          method="post"
          onSubmit={e => handleCreateGame(e)}
          className={classes.form}
        >
          <div className={classes.gridTwo}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Away Team</InputLabel>
              <Select
                labelId="away-team-select-label"
                id="away-team-select"
                value={away || ''}
                onChange={e => setAway(e.target.value as string)}
              >
                <MenuItem value={''}>Select team</MenuItem>
                {teamsData &&
                  teamsData.teams &&
                  teamsData.teams.map(team => {
                    return (
                      <MenuItem key={team._id} value={team._id}>
                        {team.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Home Team</InputLabel>
              <Select
                labelId="home-team-select-label"
                id="home-team-select"
                value={home || ''}
                onChange={e => setHome(e.target.value as string)}
              >
                <MenuItem value={''}>Select team</MenuItem>
                {teamsData &&
                  teamsData.teams &&
                  teamsData.teams.map(team => {
                    return (
                      <MenuItem key={team._id} value={team._id}>
                        {team.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Week</InputLabel>
            <Select
              labelId="away-team-select-label"
              id="away-team-select"
              value={week || ''}
              onChange={e => setWeek(e.target.value)}
            >
              <MenuItem value={''}>Select week</MenuItem>
              {['17', 'WC', 'DR', 'CC', 'SB'].map(week => {
                return (
                  <MenuItem key={week} value={week}>
                    {week}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <div className={classes.gridTwo}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date'
                  }}
                />
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="Time picker"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change time'
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Save game
          </Button>
        </form>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          className={classes.snackBar}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <CheckCircleIcon className={classes.icon} />
              Successfully created new game!
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbarOpen(false)}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]}
        />
      </Snackbar>
    </Paper>
  );
}
