import type { RiverInput } from '@whitewater-guide/schema';

import type { UpsertRiverMutationVariables } from './upsertRiver.generated';

export default (river: RiverInput): UpsertRiverMutationVariables => ({ river });
