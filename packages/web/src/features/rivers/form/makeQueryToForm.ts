import { RiverInput } from '@whitewater-guide/schema';

import { RiverFormQuery } from './riverForm.generated';

export default (regionId: string) =>
  (result?: RiverFormQuery): RiverInput => {
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
      region: {
        id: result.river.region.id,
      },
    };
  };
