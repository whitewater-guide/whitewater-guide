import { RiverInput } from '@whitewater-guide/commons';
import { toNode } from '../../../formik/utils';
import { QResult } from './riverForm.query';

export default (regionId: string) => (result?: QResult): RiverInput => {
  if (!result || !result.river) {
    return {
      id: null,
      region: { id: regionId },
      name: '',
      altNames: [],
    };
  }
  return {
    ...result.river,
    region: toNode(result.river.region),
  };
};
