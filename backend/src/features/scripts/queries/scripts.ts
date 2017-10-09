import { isAdminResolver } from '../../../apollo';
import { HarvestMode } from '../../../ww-commons';

const scripts = isAdminResolver.createResolver(
  () => [
    { script: 'galicia', harvestMode: HarvestMode.ALL_AT_ONCE },
    { script: 'norway', harvestMode: HarvestMode.ONE_BY_ONE },
  ],
);

export default scripts;
