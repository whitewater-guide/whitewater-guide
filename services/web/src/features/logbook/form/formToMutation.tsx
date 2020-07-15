import { RiverInput } from '@whitewater-guide/commons';
import { DescentFormData } from './types';
import { MVars } from './upsertDescent.mutation';

export default (data: DescentFormData): MVars => {
  return {
    descent: {
      ...data,
      startedAt: data.startedAt.toISOString(),
    },
  };
};
