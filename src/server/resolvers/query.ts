import {GraphQLObjectType, GraphQLString, GraphQLList} from 'graphql';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';

// const {GraphQLObjectType, GraphQLString, GraphQLList} = graphql;

import {User} from '../types';

import {UserType, TeamType, GameType} from '../graphql-types.js';

const User = mongoose.model('User');
const Game = mongoose.model('Game');
const Team = mongoose.model('Team');

const query = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    testQuery: {
      type: GraphQLString,
      resolve(parentArgs, args, ctx) {
        console.log('Test query called.');
        return 'Test GraphQL query successful.';
      }
    },
    aboutQuery: {
      type: GraphQLString,
      resolve(parentArgs, args, ctx) {
        console.log('About query called.');
        return 'About page GraphQL query successful.';
      }
    },
    findUserByEmail: {
      type: UserType,
      // Describe the arguments that this query will recieve
      args: {email: {type: GraphQLString}},
      // Function to return the requested data, it is passed parentValue, args
      async resolve(_, {email}) {
        const [user] = <User[]>await User.find({email}).exec();
        return user;
      }
    },
    currentUser: {
      type: UserType,
      async resolve(_, __, ctx) {
        const token = ctx.req.cookies.token;

        if (token) {
          const id = jwt.verify(token, process.env.APP_SECRET);
          const user = <User>await User.findById(id);

          return user;
        }

        return null;
      }
    },
    // TEAMS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    teams: {
      type: new GraphQLList(TeamType),
      async resolve(_, __, ctx) {
        const teams = await Team.find();

        return teams;
      }
    },
    // TEAMS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    games: {
      type: new GraphQLList(GameType),
      async resolve(_, __, ctx) {
        const games = await Game.find();

        return games;
      }
    }
  }
});

export default query;
