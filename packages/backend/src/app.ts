import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as PrettyError from 'pretty-error';
import { graphqlRouter } from './apollo/router';
import { authRouter, passport, sessionMiddleware } from './auth';

const app = express();

const BACK_CORS_WHITELIST = process.env.BACK_CORS_WHITELIST ? process.env.BACK_CORS_WHITELIST!.split(',') : [];

app.use(cors({
  origin: (origin, cb) => cb(null, BACK_CORS_WHITELIST.includes(origin)),
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sessionMiddleware());

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
