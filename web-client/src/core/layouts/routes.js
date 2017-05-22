import { regionsRoutes } from '../../features/regions';
import { sourcesRoutes } from '../../features/sources';
import { sectionsRoutes } from '../../features/sections';
import { gaugesRoutes } from '../../features/gauges';
import { riversRoutes } from '../../features/rivers';
import { usersRoutes } from '../../features/users';
import { tagsRoutes } from '../../features/tags';

export const allRoutes = [
  ...sourcesRoutes,
  ...regionsRoutes,
  ...sectionsRoutes,
  ...gaugesRoutes,
  ...riversRoutes,
  ...usersRoutes,
  ...tagsRoutes,
];
