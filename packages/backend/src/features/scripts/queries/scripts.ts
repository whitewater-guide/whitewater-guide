import { isAdminResolver } from '../../../apollo';
import { HarvestMode } from '../../../ww-commons';

const scripts = isAdminResolver.createResolver(
  () => [
    { id: 'galicia', name: 'galicia', harvestMode: HarvestMode.ALL_AT_ONCE, error: null },
    { id: 'norway', name: 'norway', harvestMode: HarvestMode.ONE_BY_ONE, error: null },
  ],
);

export default scripts;
