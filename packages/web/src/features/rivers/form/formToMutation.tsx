import { RiverInput } from '@whitewater-guide/schema';

import { UpsertRiverMutationVariables } from './upsertRiver.generated';

export default (river: RiverInput): UpsertRiverMutationVariables => ({ river });
