import { RegionAdminSettings } from '@whitewater-guide/commons';
import { QResult } from './regionAdmin.query';

export default (result: QResult): RegionAdminSettings => {
  if (!result || !result.settings) {
    // should never get here, only existing sections can be administrated
    return null as any;
  }
  return {
    ...result.settings,
    hidden: !!result.settings.hidden,
    mapsSize: result.settings.mapsSize || 0,
  };
};
