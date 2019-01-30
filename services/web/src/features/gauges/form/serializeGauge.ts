import { serializeForm } from '../../../components/forms';

export default (input?: object | null) => {
  const result = serializeForm()(input);
  if (!result) {
    return result;
  }
  const location = result.location
    ? {
        ...result.location,
        id: result.location.id || null,
        name: null,
        description: null,
        kind: 'gauge',
      }
    : null;
  const requestParams = result.requestParams
    ? JSON.parse(result.requestParams)
    : null;
  return { ...result, location, requestParams };
};
