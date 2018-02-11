import { serializeForm } from '../../../components/forms';

export default (input?: object | null) => serializeForm()(input);
