import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import pinoExpress from 'express-pino-logger';
import { graphqlRouter } from './apollo/router';
import { authRouter, passport, sessionMiddleware } from './auth';
import getOrigin from './auth/getOrigin';
import logger from './log';

const app = express();

app.use(pinoExpress({ logger }));

const CORS_WHITELIST = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST!.split(',') : [];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || CORS_WHITELIST.includes(getOrigin(origin))){
      cb(null, true);
    } else {
      cb(new Error(`${origin} is not a valid origin`));
    }
  },
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sessionMiddleware());

app.use(passport.initialize());
app.use(passport.session());
app.use(authRouter);
app.use(graphqlRouter);

export default app;
