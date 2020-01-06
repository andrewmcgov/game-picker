import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as mongoose from 'mongoose';
import {teams} from './nflTeams';
import '../models/Team';

dotenv.config({path: __dirname + '/../../.env'});

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useFindAndModify: false
});

const Team = mongoose.model('Team');

async function deleteTeams() {
  console.log('Deleting teams...');
  await Team.remove({});

  console.log('Teams deleted!');
  process.exit();
}

async function loadTeams() {
  try {
    await Team.insertMany(teams);

    console.log('Added teams!');
    process.exit();
  } catch (e) {
    console.log('Error deleting teams: \n');
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteTeams();
} else {
  loadTeams();
}
