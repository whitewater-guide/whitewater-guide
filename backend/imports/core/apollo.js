import {createApolloServer} from 'meteor/apollo';
import {makeExecutableSchema, addSchemaLevelResolveFunction} from 'graphql-tools';
import {loadSchema, getSchema} from 'graphql-loader'
import {initAccounts} from 'meteor/nicolaslopezj:apollo-accounts'
import {Roles} from 'meteor/alanning:roles';
import {typeDefs} from '../api/schema';
import {resolvers} from '../api/resolvers';
import cors from 'cors';
import graphqlExpressUpload from 'graphql-server-express-upload'
import multer from 'multer';
import path from 'path';

// Load all accounts related resolvers and type definitions into graphql-loader
initAccounts({});

loadSchema({
  typeDefs,
  resolvers,
});

// Gets all the resolvers and type definitions loaded in graphql-loader
const schema = getSchema();
const executableSchema = makeExecutableSchema({
  ...schema,
  allowUndefinedInResolve: true,
});

addSchemaLevelResolveFunction(executableSchema, (root, args, context, info) => {
  context.isAdmin = Roles.userIsInRole(context.user, ['admin']);
  context.isSuperAdmin = Roles.userIsInRole(context.user, ['super-admin']);
  return root;
});



const UPLOADS_DIR = process.env['METEOR_SHELL_DIR'] + '/../../../public/images';
console.log('PWD', process.cwd());
console.log('UPLOADS', path.resolve(UPLOADS_DIR));

const upload = multer({
  dest: UPLOADS_DIR,
});

createApolloServer(
  {
    schema: executableSchema,
  },
  {
    configServer: expressServer => expressServer.use(
      cors(),
      upload.any(),
      graphqlExpressUpload({endpointURL: 'graphql'}), // after multer and before graphqlExpress
    ),
  }
);
