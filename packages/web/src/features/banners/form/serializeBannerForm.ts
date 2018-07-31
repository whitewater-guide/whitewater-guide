import { serializeForm } from '../../../components/forms';
import { BannerInput } from '../../../ww-commons';

const serializer = serializeForm([], [], ['regions', 'groups']);

const serializeBannerForm = (input: BannerInput) => {
  return serializer(input);
};

export default serializeBannerForm;
