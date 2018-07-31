import { deserializeForm } from '../../../components/forms';
import { Banner } from '../../../ww-commons';

const deserializer = deserializeForm([], [], ['regions', 'groups']);

const deserializeBannerForm = (input: Banner) => {
  return {
    ...deserializer(input),
    extras: input.extras ? JSON.stringify(input.extras) : null,
  };
};

export default deserializeBannerForm;
