import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as PrettyError from 'pretty-error';
import { graphqlRouter } from './apollo';
import { authRouter, passport } from './auth';
import session = require('express-session');

const app = express();

const CORS_WHITELIST = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST!.split(',') : [];

app.use(cors({
  origin: (origin, cb) => cb(null, CORS_WHITELIST.includes(origin)),
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  // TODO: use session store like redis or connect-session-knex
  name: 'sid',
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET!,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);
app.use(graphqlRouter);

const prettyError = new PrettyError();
prettyError.skipNodeFiles();
prettyError.skipPackage('express');

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  process.stderr.write(prettyError.render(err));
  next();
});

export default app;
