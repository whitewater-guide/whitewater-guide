import { Tag } from '@whitewater-guide/commons';
import { serializeForm } from '../../../components/forms';

export default (input?: object | null) => {
  const result = serializeForm(['description'], ['river', 'gauge'])(input);
  if (!result) {
    return result;
  }
  const {
    kayakingTags,
    hazardsTags,
    supplyTags,
    miscTags,
    // tslint:disable-next-line:trailing-comma
    ...rest
  } = result;
  const tags = [
    ...kayakingTags,
    ...hazardsTags,
    ...supplyTags,
    ...miscTags,
  ].map((tag: Tag) => ({ id: tag.id }));
  return { ...rest, tags };
};
