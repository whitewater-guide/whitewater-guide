import { serializeForm } from '../../../components/forms';
import { BannerFormInput } from '../../../ww-commons';

const serializer = serializeForm([], [], ['regions', 'groups']);

const serializeBannerForm = (input: BannerFormInput) => {
  return {
    ...serializer(input),
    extras: input.extras ? JSON.parse(input.extras) : null,
  };
};

export default serializeBannerForm;
