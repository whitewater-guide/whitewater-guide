import { deserializeForm } from '../../../components/forms';

export default (input?: object | null) => {
  const result = deserializeForm([], ['source', 'location'])(input) as any;
  if (!result) {
    return result;
  }
  const requestParams = result.requestParams ? JSON.stringify(result.requestParams) : null;
  return { ...result, requestParams };
};
