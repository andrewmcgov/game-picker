import next from 'next';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

dotenv.config();
const port = 3000;

import './models/User.js';
import './models/Team.js';
import './models/Game.js';
import './models/Pick.js';
import schema from './schema.js';

// const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());

  // Connect to database
  mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useFindAndModify: false
  });

  const db = mongoose.connection;

  db.on('error', () => console.log('error connecting to db: '));
  db.once('open', () => console.log('Connected to database!'));

  const corsOptions = {
    origin: true,
    credentials: true
  };

  server.use('/graphql', cors(corsOptions), (req: any, res: any) =>
    graphqlHTTP({
      schema: schema,
      graphiql: true,
      context: {req, res}
    })(req, res)
  );

  server.use(async (req: any, res: any) => {
    await handle(req, res);
  });

  server.listen(port);
  console.log(`Running a GraphQL API server on port ${port}`);
});
