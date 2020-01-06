import {GraphQLObjectType, GraphQLString, GraphQLID} from 'graphql';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {randomBytes} from 'crypto';

import {User, CreateUser, Team, Game} from '../types';
import {UserType, TeamType, GameType, PickType} from '../graphql-types.js';
import {transport, makeANiceEmail} from '../mail.js';

const User = mongoose.model('User');
const Team = mongoose.model('Team');
const Game = mongoose.model('Game');
const Pick = mongoose.model('Pick');

const mutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    testMutation: {
      type: GraphQLString,
      resolve(parentArgs, args, ctx) {
        console.log('Test GraphQL mutation called.');
        return 'Test GraphQL mutation successful.';
      }
    },
    createUser: {
      type: UserType,
      args: {
        email: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        password: {type: GraphQLString},
        repeatPassword: {type: GraphQLString},
        signupKey: {type: GraphQLString}
      },
      async resolve(
        _,
        {
          email,
          firstName,
          lastName,
          password,
          repeatPassword,
          signupKey
        }: CreateUser,
        ctx
      ) {
        // Check if they are eligible for an account
        if (signupKey !== process.env.SIGNUP_KEY) {
          throw new Error('You do not have a valid Signup Key!');
        }

        // Throw an error if the passwords do not match
        if (password !== repeatPassword) {
          throw new Error('Passwords do not match!');
        }

        // Prepare email and password
        email = email.toLowerCase();
        const hash = await bcrypt.hash(password, 10);

        // Return the new user
        const user = <User>await new User({
          email,
          firstName,
          lastName,
          password: hash
        }).save();

        const token = jwt.sign({_id: user._id}, process.env.APP_SECRET);

        ctx.res.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365
        });

        return user;
      }
    },
    signIn: {
      type: UserType,
      args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      async resolve(_, {email, password}, ctx) {
        // Find the user from the DB, return if there is none
        const [user] = <User[]>await User.find({email}).exec();
        if (!user) {
          throw new Error(`Unable to find user!`);
        }

        // Check if the password is correct
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error(`Incorrect username or password!`);
        }

        // Make the JWT token
        const token = jwt.sign({_id: user._id}, process.env.APP_SECRET);

        // Set cookie to sign in the user
        ctx.res.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365
        });

        // Reuturn the signed in user
        return user;
      }
    },
    signOut: {
      type: GraphQLString,
      async resolve(_, __, ctx) {
        console.log('signout');
        ctx.res.cookie('token', '', {
          maxAge: Date.now()
        });
        return 'You have logged out!';
      }
    },
    requestReset: {
      type: GraphQLString,
      args: {
        email: {type: GraphQLString}
      },
      async resolve(_, {email}, ctx) {
        const user = <User>await User.findOne({email});

        if (!user) {
          throw new Error('Could not find a user with that email!');
        }

        const resetToken = randomBytes(20).toString('hex');
        const resetExpiry = Date.now() + 3600000; // 1 hour from now

        const updatedUser = <User>await User.findByIdAndUpdate(
          user._id,
          {
            resetToken,
            resetExpiry
          },
          {new: true}
        );

        // 3. Email them that reset token
        try {
          await transport.sendMail({
            from: 'noreply@mail.andrewmcg.dev',
            to: updatedUser.email,
            subject: 'Your Password Reset Token',
            html: makeANiceEmail([
              `Your Password Reset Link is here!`,
              `<a href="localhost:3000/reset?resetToken=${resetToken}">Click Here to Reset</a>`,
              `localhost:3000/reset?resetToken=${resetToken}`
            ])
          });
        } catch (err) {
          console.error(err);
          throw new Error('Error sending password reset email!');
        }
        return 'Password reset token sent!';
      }
    },
    resetPassword: {
      type: UserType,
      args: {
        resetToken: {type: GraphQLString},
        password: {type: GraphQLString},
        confirmPassword: {type: GraphQLString}
      },
      async resolve(_, {resetToken, password, confirmPassword}, ctx) {
        if (password !== confirmPassword) {
          throw new Error('Your passwords do not match!');
        }

        const user = <User>await User.findOne({
          resetToken: resetToken,
          resetExpiry: {
            $gte: Date.now() - 3600000
          }
        });

        if (!user) {
          throw new Error('This token is either invalid or expired!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = <User>await User.findByIdAndUpdate(
          user._id,
          {
            password: hashedPassword,
            resetToken: null,
            resetExpiry: null
          },
          {new: true}
        );

        // Sign them in
        const token = jwt.sign({_id: updatedUser._id}, process.env.APP_SECRET);

        // Set cookie to sign in the user
        ctx.res.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365
        });

        return updatedUser;
      }
    },
    // TEAMS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    createTeam: {
      type: TeamType,
      args: {
        city: {type: GraphQLString},
        name: {type: GraphQLString},
        nickname: {type: GraphQLString},
        league: {type: GraphQLString},
        abr: {type: GraphQLString}
      },
      async resolve(_, {city, name, nickname, league, abr}, ctx) {
        const team = <Team>await new Team({
          city,
          name,
          nickname,
          league,
          abr
        }).save();

        return team;
      }
    },
    // GAMES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    createGame: {
      type: GameType,
      args: {
        home: {type: GraphQLID},
        away: {type: GraphQLID},
        startTime: {
          type: GraphQLString
        },
        winner: {type: GraphQLString},
        league: {type: GraphQLString},
        season: {type: GraphQLString},
        week: {type: GraphQLString}
      },
      async resolve(
        _,
        {home, away, startTime, winner, league, season, week},
        ctx
      ) {
        const token = ctx.req.cookies.token;

        // if (!token) {
        //   throw new Error('You must be logged in to make a new game!');
        // }

        const game = await new Game({
          home,
          away,
          startTime,
          winner,
          league,
          season,
          week
        }).save();

        return game;
      }
    },
    updateGame: {
      type: GameType,
      args: {
        _id: {type: GraphQLID},
        home: {type: GraphQLID},
        away: {type: GraphQLID},
        startTime: {
          type: GraphQLString
        },
        winner: {type: GraphQLString},
        league: {type: GraphQLString},
        season: {type: GraphQLString},
        week: {type: GraphQLString}
      },
      async resolve(
        _,
        {_id, home, away, startTime, winner, league, season, week},
        ctx
      ) {
        const token = ctx.req.cookies.token;

        // if (!token) {
        //   throw new Error('You must be logged in to make a new game!');
        // }

        const game = await Game.findByIdAndUpdate(
          _id,
          {
            home,
            away,
            startTime,
            winner,
            league,
            season,
            week
          },
          {new: true}
        );

        return game;
      }
    },
    deleteGame: {
      type: GameType,
      args: {
        _id: {type: GraphQLID}
      },
      async resolve(_, {_id}, ctx) {
        const token = ctx.req.cookies.token;

        // if (!token) {
        //   throw new Error('You must be logged in to make a new game!');
        // }

        const game = await Game.findByIdAndDelete(_id);

        return game;
      }
    },
    // PICKS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    makePick: {
      type: PickType,
      args: {
        game: {type: GraphQLID},
        pick: {type: GraphQLID}
      },
      async resolve(_, {game, pick}, ctx) {
        // Get user from token
        const token = ctx.req.cookies.token;
        const user = jwt.verify(token, process.env.APP_SECRET);

        if (!token) {
          throw new Error('You must be logged in to make a pick!');
        }

        // get the game from the database
        const pickedGame = <Game>await Game.findById(game);

        if (!pickedGame) {
          throw new Error('The game you are trying to pick does not exist!');
        }

        // Check that the picked team is playing in the game
        if (
          pick !== String(pickedGame.home) &&
          pick !== String(pickedGame.away)
        ) {
          throw new Error('The picked team is not playing in this game!');
        }

        // Check that the game has not started
        if (Date.now() > new Date(pickedGame.startTime).valueOf()) {
          throw new Error('Picks for this game are locked!');
        }

        // Check if the user has already made a pick for this game
        const previousPick = await Pick.findOne({
          game,
          user
        });

        if (previousPick) {
          const updatedPick = await Pick.findByIdAndUpdate(
            previousPick._id,
            {
              game,
              pick,
              user,
              closed: false
            },
            {new: true}
          );

          return updatedPick;
        }

        const newPick = await new Pick({
          game,
          pick,
          user,
          closed: false
        }).save();

        return newPick;
      }
    }
  }
});

export default mutation;
