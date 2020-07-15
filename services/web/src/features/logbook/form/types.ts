import { Overwrite } from '@whitewater-guide/commons';
import { LogbookDescentInput } from '@whitewater-guide/logbook-schema';

export type DescentFormData = Overwrite<
  LogbookDescentInput,
  { startedAt: Date }
>;

export interface RouterParams {
  descentId?: string;
}
