import * as mongoose from 'mongoose';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList
} from 'graphql';

const User = mongoose.model('User');
const Team = mongoose.model('Team');
const Game = mongoose.model('Game');
const Pick = mongoose.model('Pick');

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {type: GraphQLString},
    email: {type: GraphQLString},
    firstName: {type: GraphQLString},
    lastName: {type: GraphQLString}
  }
});

export const TeamType = new GraphQLObjectType({
  name: 'Team',
  fields: {
    _id: {type: GraphQLID},
    city: {type: GraphQLString},
    name: {type: GraphQLString},
    nickname: {type: GraphQLString},
    league: {type: GraphQLString},
    abr: {type: GraphQLString}
  }
});

export const GameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    _id: {type: GraphQLID},
    home: {
      type: TeamType!,
      async resolve(parentValue) {
        return await Team.findById(parentValue.home);
      }
    },
    away: {
      type: TeamType!,
      async resolve(parentValue) {
        return await Team.findById(parentValue.away);
      }
    },
    startTime: {type: GraphQLString},
    hasStarted: {
      type: GraphQLBoolean,
      resolve(parentValue) {
        return Date.now() > new Date(parentValue.startTime).valueOf();
      }
    },
    winner: {
      type: TeamType,
      async resolve(parentValue) {
        return await Team.findById(parentValue.away);
      }
    },
    league: {type: GraphQLString!},
    season: {type: GraphQLString!},
    week: {type: GraphQLString!},
    picks: {
      type: new GraphQLList(PickType),
      async resolve(parentValue) {
        return await Pick.find({game: parentValue._id});
      }
    }
  })
});

export const PickType: any = new GraphQLObjectType({
  name: 'Pick',
  fields: {
    _id: {type: GraphQLID},
    game: {
      type: GameType,
      async resolve(parentValue) {
        return Game.findById(parentValue.game);
      }
    },
    pick: {
      type: TeamType,
      async resolve(parentValue) {
        return await Team.findById(parentValue.pick);
      }
    },
    user: {
      type: UserType,
      async resolve(parentValue) {
        return await User.findById(parentValue.user);
      }
    },
    closed: {
      type: GraphQLBoolean
    },
    correct: {
      type: GraphQLBoolean
    }
  }
});
