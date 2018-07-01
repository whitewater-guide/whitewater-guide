declare module 'graphql-iso-date' {
  import { GraphQLScalarType } from 'graphql';
  export const GraphQLDateTime: GraphQLScalarType;
}

declare module 'graphql-type-json' {
  import { GraphQLScalarType } from 'graphql';
  const GraphQLJSON: GraphQLScalarType;
  export default GraphQLJSON;
}

declare module 'http-shutdown' {
  import { Server } from 'http';
  interface Shutdownable {
    shutdown: (callback?: () => void) => void;
  }
  function httpShutdown(server: Server): Server & Shutdownable;
  export = httpShutdown;
}

declare module 'cron-parser';
