import {regionsRoutes} from '../../features/regions';
import {sourcesRoutes} from '../../features/sources';
import {sectionsRoutes} from '../../features/sections';
import {gaugesRoutes} from '../../features/gauges';
import {riversRoutes} from '../../features/rivers';

export const allRoutes = [
  ...sourcesRoutes,
  ...regionsRoutes,
  ...sectionsRoutes,
  ...gaugesRoutes,
  ...riversRoutes,
];