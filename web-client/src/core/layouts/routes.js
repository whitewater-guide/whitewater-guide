import {regionsRoutes} from '../../features/regions';
import {sourcesRoutes} from '../../features/sources';
import {sectionsRoutes} from '../../features/sections';
import {gaugesRoutes} from '../../features/gauges';
import {riversRoutes} from '../../features/rivers';
import {filesRoutes} from "../../features/files";

export const allRoutes = [
  ...sourcesRoutes,
  ...regionsRoutes,
  ...sectionsRoutes,
  ...gaugesRoutes,
  ...riversRoutes,
  ...filesRoutes,
];