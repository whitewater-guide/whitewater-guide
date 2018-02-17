import { deserializeForm } from '../../../components/forms';
import { omit } from 'lodash';

export default (input?: object | null) => {
  const result = deserializeForm(['description'], ['river'], ['pois'])(input) as any;
  if (!result) {
    return result;
  }
  const { flows, levels } = result;
  return {
    ...result,
    flows: flows ? omit(flows, ['__typename']) : null,
    levels: levels ? omit(levels, ['__typename']) : null,
  };
};
