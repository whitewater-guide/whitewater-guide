import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import merge from 'lodash/merge';

import { bannersResolvers } from '~/features/banners';
import { descentResolvers } from '~/features/descents';
import { emailsResolvers } from '~/features/emails';
import { gaugesResolvers } from '~/features/gauges';
import { groupsResolvers } from '~/features/groups';
import { licensesResolvers } from '~/features/licenses';
import { measurementsResolvers } from '~/features/measurements';
import { mediaResolvers } from '~/features/media';
import { pointsResolvers } from '~/features/points';
import { purchasesResolvers } from '~/features/purchases';
import { regionsResolvers } from '~/features/regions';
import { riversResolvers } from '~/features/rivers';
import { scriptsResolvers } from '~/features/scripts';
import { sectionsResolvers } from '~/features/sections';
import { sourcesResolvers } from '~/features/sources';
import { suggestionsResolvers } from '~/features/suggestions';
import { tagsResolvers } from '~/features/tags';
import { uploadsResolvers } from '~/features/uploads';
import { usersResolvers } from '~/features/users';

import { CursorScalar } from '../cursor';

export const resolvers = merge(
  bannersResolvers,
  descentResolvers,
  emailsResolvers,
  gaugesResolvers,
  groupsResolvers,
  licensesResolvers,
  tagsResolvers,
  pointsResolvers,
  purchasesResolvers,
  regionsResolvers,
  riversResolvers,
  scriptsResolvers,
  sectionsResolvers,
  sourcesResolvers,
  suggestionsResolvers,
  usersResolvers,
  mediaResolvers,
  measurementsResolvers,
  uploadsResolvers,
  {
    Date: GraphQLDateTime,
    JSON: GraphQLJSON,
    Cursor: CursorScalar,
  },
);
