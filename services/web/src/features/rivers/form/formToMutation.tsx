import { RiverInput } from '@whitewater-guide/commons';
import { MVars } from './upsertRiver.mutation';

export default (river: RiverInput): MVars => ({ river });
