import { deserializeForm } from '../../../components/forms';

export default (input?: object | null) => deserializeForm([], ['region'])(input);
