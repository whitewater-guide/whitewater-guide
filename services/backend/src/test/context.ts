import { newContext } from '@apollo';
import { createConnectors } from '@db/connectors';
import { UserRaw } from '@features/users';
import Koa from 'koa';

const FakeKoaContext: Partial<Koa.Context> = {
  acceptsLanguages: () => false,
  set: () => {},
};

export const fakeContext = (user?: UserRaw, language?: string) => {
  const context = newContext(
    {
      ctx: {
        headers: {},
        state: { user },
        ...FakeKoaContext,
      },
    },
    language,
  );
  // This is what apollo-server does
  // tslint:disable-next-line
  // https://github.com/apollographql/apollo-server/blob/c4d3a93e7bc8a9ffb1692c50a4f766422f30e665/packages/apollo-server-core/src/runHttpQuery.ts#L345
  const dataSources = createConnectors();
  for (const dataSource of Object.values(dataSources)) {
    if (dataSource.initialize) {
      dataSource.initialize({ context });
    }
  }
  context.dataSources = dataSources;
  return context;
};

export const anonContext = (language?: string) =>
  fakeContext(undefined, language);
