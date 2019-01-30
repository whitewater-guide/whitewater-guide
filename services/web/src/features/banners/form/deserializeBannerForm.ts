import { Banner } from '@whitewater-guide/commons';
import { deserializeForm } from '../../../components/forms';

const deserializer = deserializeForm([], [], ['regions', 'groups']);

const deserializeBannerForm = (input: Banner) => {
  return {
    ...deserializer(input),
    extras: input.extras ? JSON.stringify(input.extras) : null,
  };
};

export default deserializeBannerForm;
