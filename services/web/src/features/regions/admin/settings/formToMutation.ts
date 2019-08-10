import { RegionAdminSettings } from '@whitewater-guide/commons';
import { MVars } from './administrateRegion.mutation';

export default (settings: RegionAdminSettings): MVars => ({ settings });
