import omit from 'lodash/omit';
import { deserializeForm } from '../../../components/forms';
import { Region } from '../../../ww-commons';

export default (data: Region) => {
  const interm = deserializeForm(['description'], ['pois'])(data);
  return omit(interm, 'hidden', 'premium');
};
