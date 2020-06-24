import {
  ApolloGateway,
  LocalGraphQLDataSource,
  RemoteGraphQLDataSource,
} from '@apollo/gateway';
import { GraphQLRequestContext } from 'apollo-server-types';
import { Context } from '../context';
import { getSchema } from './schema';
import { getAccessToken } from '../../auth/jwt/tokens';

const LOCAL_SERVICE_URL = 'https://local.service';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({
    request,
    context,
  }: Pick<GraphQLRequestContext<Context>, 'request' | 'context'>) {
    // Pass the user's id from the context to underlying services
    // as a header called `user-id`
    if (context.user) {
      const token = getAccessToken(context.user.id);
      request.http?.headers.set('Authorization', `Bearer ${token}`);
    }
  }
}
export const createGateway = async () => {
  const schema = await getSchema();
  return new ApolloGateway({
    serviceList: [
      { name: 'local', url: LOCAL_SERVICE_URL },
      {
        name: 'logbook',
        url:
          process.env.NODE_ENV === 'test'
            ? 'http://localhost:3003/graphql'
            : 'http://logbook:3333/graphql',
      },
    ],
    buildService({ url }) {
      if (url === LOCAL_SERVICE_URL) {
        return new LocalGraphQLDataSource(schema);
      } else {
        return new AuthenticatedDataSource({
          url,
        });
      }
    },
  });
};
