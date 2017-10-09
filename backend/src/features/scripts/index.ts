import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';

export const ScriptsSchema = loadGraphqlFile('scripts');
export * from './resolvers';
