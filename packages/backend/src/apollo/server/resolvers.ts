import { DateResolver, DateTimeResolver, JSONResolver } from 'graphql-scalars';
import { merge } from 'lodash';

import { bannersResolvers } from '../../features/banners/index';
import { descentResolvers } from '../../features/descents/index';
import { emailsResolvers } from '../../features/emails/index';
import { gaugesResolvers } from '../../features/gauges/index';
import { groupsResolvers } from '../../features/groups/index';
import { licensesResolvers } from '../../features/licenses/index';
import { measurementsResolvers } from '../../features/measurements/index';
import { mediaResolvers } from '../../features/media/index';
import { pointsResolvers } from '../../features/points/index';
import { purchasesResolvers } from '../../features/purchases/index';
import { regionsResolvers } from '../../features/regions/index';
import { riversResolvers } from '../../features/rivers/index';
import { scriptsResolvers } from '../../features/scripts/index';
import { sectionsResolvers } from '../../features/sections/index';
import { sourcesResolvers } from '../../features/sources/index';
import { suggestionsResolvers } from '../../features/suggestions/index';
import { tagsResolvers } from '../../features/tags/index';
import { uploadsResolvers } from '../../features/uploads/index';
import { usersResolvers } from '../../features/users/index';
import { CoordinatesScalar } from '../coordinates';
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
    Date: DateResolver,
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    Cursor: CursorScalar,
    Coordinates: CoordinatesScalar,
  },
);
